import prisma from "../../config/prisma.ts"
import { AppError } from "../../errors/appError.ts";
import { User } from "../employees/employee.service.ts";
import { AssignDepartmentManagerDto, CreateDepartmentDto, UpdateDepartmentDto } from "./department.validator.ts"

export const createDepartment = async (data: CreateDepartmentDto) => {

    const existingDepartment = await prisma.department.findUnique({
        where: {
            name: data.name
        }
    })

    if (existingDepartment) {
        throw new AppError(
            "Department already exists.",
            409,
            "DUPLICATE_DEPARTMENT");
    }

    const department = await prisma.department.create({
        data: {
            name: data.name,
            description: data.description,
            status: data.status,
        },
    });

    return department;

}

export const getDepartmentById = async (id: string, user: User) => {


    if (user.role !== "admin" && user.role !== "hr") {
        throw new AppError(
            "You do not have permission to access this resource.",
            403,
            "FORBIDDEN");
    }

    const department = await prisma.department.findUnique({
        where: {
            id,
        },
        include: {
            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },

            employees: {
                select: {
                    id: true,
                },
            },
        },
    });

    if (!department) {
        throw new AppError(
            "Department not found.",
            404,
            "DEPARTMENT_NOT_FOUND");
    }

    const { employees, ...departmentData } = department;

    return {
        ...departmentData,
        employee_count: department.employees.length,
    };
}

export const getDepartments = async (user: User) => {

    if (user.role !== "admin" && user.role !== "hr") {
        throw new AppError(
            "You do not have permission to access this resource.",
            403,
            "FORBIDDEN");
    }

    const departments = await prisma.department.findMany({
        include: {
            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },
            _count: {
                select: {
                    employees: {
                        where: {
                            status: {
                                not: "terminated"
                            }
                        }
                    }
                },
            },
        },
    });

    const formattedDepartments = departments.map(
        ({ _count, ...department }) => ({
            ...department,
            employee_count: _count.employees,
        })
    );


    return formattedDepartments;

}

type UpdateDepartmentInput = {
    id: string;
    data: Partial<UpdateDepartmentDto>;
    user: User
};


export const updateDepartment = async ({
    id,
    data,
    user
}: UpdateDepartmentInput) => {

    const department = await prisma.department.findUnique({
        where: { id }
    })

    if (!department) {
        throw new AppError(
            "Department not found",
            404,
            "DEPARTMENT_NOT_FOUND"
        );
    }

    const isAdmin = user.role === "admin" || user.role !== "hr";

    if (!isAdmin) {
        throw new AppError(
            "You are not allowed to update departments",
            403,
            "FORBIDDEN"
        )
    }


    const updatedDepartment = await prisma.department.update({
        where: { id },
        data,
    });

    return updatedDepartment;

}
type AssignDepartmentManagerInput = {
    id: string;
    data: AssignDepartmentManagerDto;
    user: User;
};

export const assignDepartmentManager = async ({
    id,
    data,
    user,
}: AssignDepartmentManagerInput) => {

    const { manager_id } = data;

    // 1. Check department exists
    const department = await prisma.department.findUnique({
        where: { id },
    });

    if (!department) {
        throw new AppError(
            "Department not found",
            404,
            "DEPARTMENT_NOT_FOUND"
        );
    }

    // 2. Check authorization
    if (user.role !== "admin") {
        throw new AppError(
            "You are not allowed to assign department managers",
            403,
            "FORBIDDEN"
        );
    }

    // 3. Check employee exists and is active
    const employee = await prisma.employee.findUnique({
        where: { id: manager_id },
    });

    if (!employee) {
        throw new AppError(
            "Employee not found",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    if (employee.status !== "active") {
        throw new AppError(
            "Only active employees can be assigned as department managers",
            400,
            "EMPLOYEE_NOT_ACTIVE"
        );
    }

    if (employee.role !== "manager") {
        throw new AppError(
            "Only employees with manager role can be assigned as department managers",
            400,
            "INVALID_MANAGER"
        );
    }

    // 4. Check if employee already manages another department
    const existingDepartment = await prisma.department.findFirst({
        where: {
            manager_id,
            NOT: {
                id,
            },
        },
    });

    if (existingDepartment) {
        throw new AppError(
            "This employee is already managing another department",
            409,
            "ALREADY_DEPARTMENT_MANAGER"
        );
    }

    // 5. Assign manager
    const updatedDepartment = await prisma.department.update({
        where: { id },
        data: {
            manager_id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            manager_id: true,
            created_at: true,
            updated_at: true,

            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    job_title: true,
                    role: true,
                    status: true,
                },
            },
        },
    });

    // 6. TODO: Notify employee

    // 7. TODO: Write audit log

    return updatedDepartment;
};



export const teamMembers = async (departmentId: string) => {


    const department = await prisma.department.findUnique({
        where: {
            id: departmentId,
        },
        include: {
            manager: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    job_title: true,
                    avatar_url: true,
                    status: true
                },
            },
            employees: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    job_title: true,
                    avatar_url: true,
                    status: true,
                },
            },
        },
    });

    if (!department) {
        throw new AppError(
            "Department not found.",
            404,
            "DEPARTMENT_NOT_FOUND"
        );
    }

    return {
        manager: department.manager,
        members: department.employees.filter((employee) => (employee.id !== department.manager_id)),
    };
};


export const removeDepartmentManager = async (
    departmentId: string,
    user: User
) => {

    console.log("SERVICE DEPARTMENT ID:", departmentId);

    if (user.role !== "admin" && user.role !== "hr") {
        throw new AppError(
            "You do not have permission to perform this action.",
            403,
            "FORBIDDEN"
        );
    }

    const department = await prisma.department.findUnique({
        where: {
            id: departmentId,
        },
    });

    if (!department) {
        throw new AppError(
            "Department not found.",
            404,
            "DEPARTMENT_NOT_FOUND"
        );
    }

    if (!department.manager_id) {
        throw new AppError(
            "This department has no manager assigned.",
            400,
            "NO_MANAGER_ASSIGNED"
        );
    }

    return prisma.department.update({
        where: {
            id: departmentId,
        },
        data: {
            manager_id: null,
        },
    });
};

export const teamRecentActivities = async (departmentId: string) => {
    const activities = await prisma.activityLog.findMany({
        where: {
            department_id: departmentId,
        },
        orderBy: {
            created_at: "desc",
        },
        take: 10,
        include: {
            user: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });

    return activities;
};

export const getDepartmentStats = async (departmentId: string) => {

    const employees = await prisma.employee.findMany({
        where: {
            department_id: departmentId,
            status: {
                not: "terminated",
            },
        },
        select: {
            id: true,
            status: true,
            leaveRequests: {
                where: {
                    status: "approved",
                    start_date: {
                        lte: new Date(),
                    },
                    end_date: {
                        gte: new Date(),
                    },
                },
                select: {
                    id: true,
                },
            },
        },
    });

    const total = employees.length;

    const onLeave = employees.filter(
        (employee) => employee.leaveRequests.length > 0
    ).length;

    const active = employees.filter(
        (employee) =>
            employee.status === "active" &&
            employee.leaveRequests.length === 0
    ).length;

    const inactive = total - active - onLeave

    return {
        total,
        active: {
            count: active,
            percentage: total
                ? Math.round((active / total) * 100)
                : 0,
        },

        onLeave: {
            count: onLeave,
            percentage: total
                ? Math.round((onLeave / total) * 100)
                : 0,
        },
        inactive: {
            count: inactive,
            percentage: total
                ? Math.round((inactive / total) * 100)
                : 0,
        }

    };
};