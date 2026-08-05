import prisma from "../../config/prisma.ts"
import { AppError } from "../../errors/appError.ts";
import { User } from "../employees/employee.service.ts";
import { CreateDepartmentDto } from "./department.validator.ts"

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
                        where:{
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


export const updateDepartment = async () => {

}

export const assignDepartmentManager = () => {

}
export const deactiveDepartment = () => {

}