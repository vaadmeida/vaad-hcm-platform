import prisma from "../../config/prisma.ts"
import { AppError } from "../../errors/appError.ts";
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

export const getDepartmentById = () => {

}
export const getDepartments = () => {

}
export const updateDepartment = () => {

}
export const assignDepartmentManager = () => {

}
export const deactiveDepartment = () => {

}