import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";
import { calculateWorkingDays } from "../../utils/date.utils.ts";
import { User } from "../employees/employee.service.ts";

type CreateLeaveTypes = {
    name: string;
    user: {
        id: string;
        role: "admin" | "manager" | "employee";
    };
    default_days_per_year?: number | null;
    requires_document?: boolean
    is_paid?: boolean;
    carries_over?: boolean;
    max_carryover_days?: number | null;
};

type GetLeaveRequestsInput = {
    user: {
        id: string;
        role: "admin" | "manager" | "employee";
    };
    status?: string;
    employee_id?: string;
};

type SubmitLeaveRequestType = {
    leave_type_id: string
    start_date: Date
    end_date: Date
    reason: string
}



export const createLeaveTypes = async ({
    name,
    is_paid,
    carries_over,
    requires_document,
    max_carryover_days,
    default_days_per_year,
    user }: CreateLeaveTypes) => {

    if (user.role !== 'admin') {
        throw new AppError("You do not have permission for this action", 403, "NOT_AUTHORIZED")
    }

    if (!name || name.trim().length < 3) {
        throw new AppError(
            "Leave type name is required and must be at least 3 characters",
            400,
            "INVALID_NAME"
        );
    }

    const maxCarryover = max_carryover_days ?? 0;

    if (!carries_over && maxCarryover > 0) {
        throw new AppError(
            "max_carryover_days must be 0 when carries_over is false",
            400,
            "INVALID_CARRYOVER"
        );
    }

    if (is_paid === false && carries_over === true) {
        throw new AppError(
            "Unpaid leave cannot carry over days",
            400,
            "INVALID_POLICY"
        );
    }

    const normalizedName = name.trim();

    const existing = await prisma.leaveType.findFirst({
        where: { name: normalizedName }
    });


    if (existing) {
        throw new AppError(
            "Leave type already exists",
            409,
            "DUPLICATE_LEAVE_TYPE"
        );
    }

    const leaveType = await prisma.leaveType.create({
        data: {
            name: normalizedName,
            default_days_per_year: default_days_per_year ?? null,
            is_paid: is_paid ?? false,
            requires_document: requires_document ?? false,
            carries_over: carries_over ?? false,
            max_carryover_days: maxCarryover,
        },
    });

    return leaveType;
}

export const getLeaveTypes = async (id: string, user: { id: string; role: string }) => {

    const leave = await prisma.leaveType.findUnique({
        where: { id }
    })

    if (!leave) {
        throw new AppError("Leave not found", 404, "LEAVE_NOT_FOUND");
    }

    const isAdmin = user.role = 'admin'

    if (!isAdmin) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    return leave

}

export const getAllLeaveTypes = async () => {
    const leaveTypes = await prisma.leaveType.findMany({
        orderBy: {
            name: "asc",
        }
    })

    return leaveTypes
}


export const getMyLeaveBalance = async (loggedInUserId: string, employeeId: string) => {

    if (loggedInUserId !== employeeId) {
        throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    const balances = await prisma.leaveBalance.findMany({
        where: {
            employee_id: employeeId,
        },
        include: {
            leaveType: true,
        },
    });

    if (balances.length === 0) {
        throw new AppError(
            "Leave balance not found",
            404,
            "LEAVE_BALANCE_NOT_FOUND"
        );
    }

    return balances;
};
export const getLeaveRequests = async ({
    user,
    status,
    employee_id,
}: GetLeaveRequestsInput) => {

    const isAdmin = user.role === "admin";
    const isManager = user.role === "manager";
    const isEmployee = user.role === "employee";

    if (isEmployee) {
        employee_id = user.id;
    }

    if (isManager && employee_id) {

        const employee = await prisma.employee.findUnique({
            where: { id: employee_id },
            select: {
                manager_id: true,
            },
        });

        if (!employee) {
            throw new AppError(
                "Employee not found",
                404,
                "EMPLOYEE_NOT_FOUND"
            );
        }

        if (employee.manager_id !== user.id) {
            throw new AppError(
                "Forbidden",
                403,
                "FORBIDDEN"
            );
        }
    }


    const leaveRequests = await prisma.leaveRequest.findMany({
        where: {
            ...(status && { status }),
            ...(employee_id && { employee_id }),
            ...(isManager && !employee_id
                ? {
                    employee: {
                        manager_id: user.id,
                    },
                }
                : {}),
        },
        select: {
            id: true,
            start_date: true,
            end_date: true,
            total_days: true,
            reason: true,
            status: true,
            approved_at: true,
            created_at: true,
            employee: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                },
            },

            leaveType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });


    return leaveRequests.map((request) => ({
        id: request.id,
        start_date: request.start_date,
        end_date: request.end_date,
        total_days: request.total_days,
        reason: request.reason,
        status: request.status,
        approved_at: request.approved_at,
        created_at: request.created_at,
        employee: {
            id: request.employee.id,
            name: `${request.employee.first_name} ${request.employee.last_name}`,
            email: request.employee.email,
        },

        leave_type: {
            id: request.leaveType.id,
            name: request.leaveType.name,
        },
    }));
};

export const seedLeaveBalance = async (tx: Prisma.TransactionClient, employeeId: string) => {

    const currentYear = new Date().getFullYear();

    const leaveTypes = await tx.leaveType.findMany({
        select: {
            id: true,
            default_days_per_year: true,
        },
    });

    for (const leaveType of leaveTypes) {
        await tx.leaveBalance.upsert({
            where: {
                employee_id_leave_type_id_year: {
                    employee_id: employeeId,
                    leave_type_id: leaveType.id,
                    year: currentYear
                },
            },
            update: {},
            create: {
                employee_id: employeeId,
                leave_type_id: leaveType.id,
                year: currentYear,
                entitled_days: leaveType.default_days_per_year ?? 0,
            },
        });
    }
};

export const submitLeaveRequests = async (
    employeeId: string,
    data: SubmitLeaveRequestType
) => {

    return prisma.$transaction(async (tx) => {


        const totalDays = calculateWorkingDays({
            startDate: data.start_date,
            endDate: data.end_date
        })

        const currentYear = new Date().getFullYear()

        const balance = await tx.leaveBalance.findUnique({
            where: {
                employee_id_leave_type_id_year: {
                    employee_id: employeeId,
                    leave_type_id: data.leave_type_id,
                    year: currentYear
                }
            }
        })

        if (!balance) {
            throw new AppError(
                "Leave balance record not found",
                404,
                "NO_BALANCE_RECORD"
            );
        }

        const remaining =
            Number(balance.entitled_days) -
            Number(balance.used_days ?? 0) -
            Number(balance.pending_days ?? 0);

        if (remaining < totalDays) {
            throw new AppError(
                "Insufficient leave balance",
                400,
                "INSUFFICIENT_BALANCE"
            );
        }

        const overlap = await tx.leaveRequest.findFirst({
            where: {
                employee_id: employeeId,
                status: {
                    in: ["pending", "approved"]
                },
                start_date: {
                    lte: data.end_date
                },
                end_date: {
                    gte: data.start_date
                }
            }
        })

        if (overlap) {
            throw new AppError(
                "Leave request overlaps with an existing request",
                400,
                "DATE_OVERLAP"
            );
        }
        const request = await tx.leaveRequest.create({
            data: {
                employee_id: employeeId,
                leave_type_id: data.leave_type_id,
                start_date: data.start_date,
                end_date: data.end_date,
                total_days: totalDays,
                reason: data.reason,
                status: "pending",
            },
        });

        await tx.leaveBalance.update({
            where: {
                employee_id_leave_type_id_year: {
                    employee_id: employeeId,
                    leave_type_id: data.leave_type_id,
                    year: currentYear,
                },
            },
            data: {
                pending_days: {
                    increment: totalDays,
                },
            },
        });

        return request

    });

}

export const approveOrRejectRequest = async (
    action: "APPROVE" | "REJECT",
    requestId: string,
    role: string,
    managerId: string,
    rejectionReason?: string) => {

    const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id: requestId },
        include: {
            employee: true
        }
    })

    if (!leaveRequest) {
        throw new AppError(
            "Leave request not found",
            404,
            "LEAVE_REQUEST_NOT_FOUND"
        );
    }

    if (leaveRequest.status !== "pending") {
        throw new AppError(
            "Request has already been processed",
            400,
            "ALREADY_PROCESSED"
        );
    }

    if (role === "manager") {
        if (leaveRequest.employee.manager_id !== managerId) {
            throw new AppError(
                "Forbidden",
                403,
                "FORBIDDEN"
            );
        }
    }

    const year = leaveRequest.start_date.getFullYear();

    return await prisma.$transaction(async (tx) => {

        if (action === "APPROVE") {
            await tx.leaveBalance.update({
                where: {
                    employee_id_leave_type_id_year: {
                        employee_id: leaveRequest.employee_id,
                        leave_type_id: leaveRequest.leave_type_id,
                        year
                    }
                },
                data: {
                    used_days: {
                        increment: leaveRequest.total_days
                    },
                    pending_days: {
                        decrement: leaveRequest.total_days
                    },
                }
            })

            await tx.leaveRequest.update({
                where: {
                    id: requestId,
                },
                data: {
                    status: "approved",
                    approved_by: managerId,
                    approved_at: new Date(),
                },
            });

        } else {

            if (action === "REJECT") {
                if (!rejectionReason) {
                    throw new AppError(
                        "Rejection reason is required",
                        400,
                        "VALIDATION_ERROR"
                    );
                }
            }

            await tx.leaveBalance.update({
                where: {
                    employee_id_leave_type_id_year: {
                        employee_id: leaveRequest.employee_id,
                        leave_type_id: leaveRequest.leave_type_id,
                        year,
                    },
                },
                data: {
                    pending_days: {
                        decrement: leaveRequest.total_days,
                    },
                },
            });

            await tx.leaveRequest.update({
                where: {
                    id: requestId,
                },
                data: {
                    status: "rejected",
                    approved_by: managerId,
                    approved_at: new Date(),
                    rejection_reason: rejectionReason,
                },
            });

        }
    })
}

export const cancelRequest = async (requestId: string, employeeId: string) => {

    const request = await prisma.leaveRequest.findUnique({
        where: { id: requestId },
        include: { employee: true }
    })

    if (!request) {
        throw new AppError(
            "Leave request not found",
            404,
            "LEAVE_REQUEST_NOT_FOUND"
        );
    }

    if (request.employee_id !== employeeId) {
        throw new AppError(
            "Not allowed to perform this request",
            403,
            "FORBIDDEN"
        );
    }

    if (request.status !== "pending") {
        throw new AppError(
            "Only pending leave requests can be cancelled.",
            400,
            "CANNOT_CANCEL_REQUEST"
        );
    }

    const balanceyear = request.start_date.getFullYear()

    return await prisma.$transaction(async (tx) => {

        await tx.leaveBalance.update({
            where: {
                employee_id_leave_type_id_year: {
                    employee_id: request.employee_id,
                    leave_type_id: request.leave_type_id,
                    year: balanceyear
                }
            },
            data: {
                pending_days: {
                    decrement: request.total_days
                }
            }
        })

        const cancelledRequest = await tx.leaveRequest.update({

            where: {
                id: requestId
            },
            data: {
                status: "cancelled",
                cancelled_at: new Date(),
            }
        });

        return cancelledRequest

    })
}


export const getAdminLeaveStats = async () => {
    const today = new Date();

    const [
        totalRequests,
        pendingRequests,
        approvedLeaves,
        currentlyOnLeave,
    ] = await Promise.all([
        prisma.leaveRequest.count(),

        prisma.leaveRequest.count({
            where: {
                status: "pending",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "approved",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "approved",
                start_date: {
                    lte: today,
                },
                end_date: {
                    gte: today,
                },
            },
        }),
    ]);

    return {
        totalRequests,
        pendingRequests,
        approvedLeaves,
        currentlyOnLeave,
    };
};

export const getManagerLeaveStats = async (managerId: string) => {
    const today = new Date();

    const [totalRequests, pendingRequests, approvedRequests, currentlyOnLeave] = await Promise.all([
        prisma.leaveRequest.count({
            where: {
                employee: {
                    department: {
                        manager_id: managerId,
                    },
                },
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "pending",
                employee: {
                    department: {
                        manager_id: managerId,
                    },
                },
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "approved",
                employee: {
                    department: {
                        manager_id: managerId,
                    },
                },
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "approved",
                start_date: {
                    lte: today,
                },
                end_date: {
                    gte: today,
                },
                employee: {
                    department: {
                        manager_id: managerId,
                    },
                },
            },
        }),
    ]);

    return {
        totalRequests,
        pendingRequests,
        approvedRequests,
        currentlyOnLeave,
    };
};
export const getEmployeeLeaveStats = async (employeeId: string) => {
    const today = new Date();

    const [
        totalRequests,
        pendingRequests,
        approvedLeaves,
        rejectedLeaves,
        currentlyOnLeave,
    ] = await Promise.all([
        prisma.leaveRequest.count({
            where: {
                employee_id: employeeId,
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee_id: employeeId,
                status: "pending",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee_id: employeeId,
                status: "approved",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee_id: employeeId,
                status: "rejected",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee_id: employeeId,
                status: "approved",
                start_date: {
                    lte: today,
                },
                end_date: {
                    gte: today,
                },
            },
        }),
    ]);

    return {
        totalRequests,
        pendingRequests,
        approvedLeaves,
        rejectedLeaves,
        currentlyOnLeave,
    };
};

export const getUpcomingLeave = async (user: any) => {
    const today = new Date();

    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    let roleFilter = {};

    if (user.role === "admin" || user.role === "hr") {
        roleFilter = {};
    } else if (user.role === "manager") {
        roleFilter = {
            employee: {
                department: {
                    manager_id: user.id,
                },
            },
        };
    } else if (user.role === "employee") {
        roleFilter = {
            employee: {
                id: user.id,
            },
        };
    }

    const upcomingLeave = await prisma.leaveRequest.findMany({
        where: {
            status: "approved",
            start_date: {
                gte: today,
                lte: thirtyDaysFromNow,
            },
            ...roleFilter,
        },
        select: {
            id: true,
            start_date: true,
            end_date: true,
            total_days: true,
            status: true,
            employee: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },
            leaveType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            start_date: "asc",
        },
        take: 5
    });

    return upcomingLeave;
};

export const getRecentLeaveRequest = async (user: any) => {
    let roleFilter = {};

    if (user.role === "admin" || user.role === "hr") {
        roleFilter = {};
    } else if (user.role === "manager") {
        roleFilter = {
            employee: {
                department: {
                    manager_id: user.id,
                },
            },
        };
    } else if (user.role === "employee") {
        roleFilter = {
            employee: {
                id: user.id,
            },
        };
    }

    const recentRequests = await prisma.leaveRequest.findMany({
        where: {
            ...roleFilter,
        },
        select: {
            id: true,
            start_date: true,
            end_date: true,
            total_days: true,
            status: true,
            created_at: true,

            employee: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },

            leaveType: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
        take: 5,
    });

    return recentRequests;
};