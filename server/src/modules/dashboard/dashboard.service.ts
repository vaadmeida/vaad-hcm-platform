import prisma from "../../config/prisma.ts"
import { Request } from "express";
import { AppError } from "../../errors/appError.ts";

export const getAdminStats = async () => {

    const [totalEmployees, totalDepartments, activeEmployees, pendingLeaveRequests,
    ] = await Promise.all([
        prisma.employee.count(),
        prisma.department.count(),
        prisma.employee.count({
            where: {
                status: "active"
            }
        }),
        prisma.leaveRequest.count({
            where: {
                status: "pending"
            }
        })

    ])

    return {
        totalEmployees,
        totalDepartments,
        activeEmployees,
        pendingLeaveRequests
    }

}

export const getHRStats = async () => {
    const [
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
    ] = await Promise.all([
        prisma.employee.count(),
        prisma.employee.count({
            where: {
                status: "active",
            },
        }),
        prisma.employee.count({
            where: {
                status: "inactive",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                status: "pending",
            },
        }),

        prisma.department.count(),
    ]);

    return {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        pendingLeaveRequests,
    };
};

export const getManagerStats = async (managerId: string) => {
    
    const [
        teamMembers,
        activeTeamMembers,
        pendingLeaveApprovals,
        teamOnLeave,
    ] = await Promise.all([
        prisma.employee.count({
            where: {
                manager_id: managerId,
            },
        }),

        prisma.employee.count({
            where: {
                manager_id: managerId,
                status: "active",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee: {
                    manager_id: managerId,
                },
                status: "pending",
            },
        }),

        prisma.leaveRequest.count({
            where: {
                employee: {
                    manager_id: managerId,
                },
                status: "approved",
                start_date: {
                    lte: new Date(),
                },
                end_date: {
                    gte: new Date(),
                },
            },
        }),
    ]);

    return {
        teamMembers,
        activeTeamMembers,
        pendingLeaveApprovals,
        teamOnLeave,
    };
};

export const getEmployeeStats = async (employeeId: string) => {
    const [
        pendingLeaveRequests,
        approvedLeaveRequests,
        rejectedLeaveRequests,
        totalLeaveTypes,
    ] = await Promise.all([
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

        prisma.leaveType.count(),
    ]);

    return {
        pendingLeaveRequests,
        approvedLeaveRequests,
        rejectedLeaveRequests,
        totalLeaveTypes,
    };

};


export const getEmployeesByDepartment = async () => {

    const departments = await prisma.department.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    employees: true
                }
            }
        }
    })

    const chartData = departments.map((department) => ({
        department: department.name,
        employees: department._count.employees,
    }));

    return chartData;
}

export type AuthUser = NonNullable<Request['user']>

export const getLeaveOverview = async (user: AuthUser) => {


    if (user.role === "admin" || user.role === "hr") {

        const leavesOverview = await prisma.leaveRequest.groupBy({
            by: ["status"],
            _count: {
                status: true,
            },
        });

        return leavesOverview.map((leaveOverview) => ({
            leaveStatus: leaveOverview.status,
            count: leaveOverview._count.status,
        }));


    } else if (user.role === "manager") {

        const employees = await prisma.employee.findMany({
            where: {
                manager_id: user.id,
            },
            select: {
                id: true,
            },
        });

        const employeeIds = employees.map((employee) => employee.id);

        const leavesOverview = await prisma.leaveRequest.groupBy({
            by: ["status"],
            where: {
                employee_id: {
                    in: employeeIds,
                },
            },
            _count: {
                status: true,
            },
        });
        return leavesOverview.map((leaveOverview) => ({
            leaveStatus: leaveOverview.status,
            count: leaveOverview._count.status,
        }));

    } else {
        throw new AppError(
            "Unauthorized",
            403,
            "FORBIDDEN"
        );
    }

};