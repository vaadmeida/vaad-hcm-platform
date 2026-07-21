import { Request, Response } from "express"
import { createDepartmentSchema } from "./department.validator.ts"
import { createDepartment } from "./department.service.ts";

export const createDepartmentController = async (req: Request, res: Response) => {

    const parsed =  createDepartmentSchema.parse(req.body)

    const department = await createDepartment(parsed);
    
    return res.status(201).json({
        success: true,
        message: "Department created successfully.",
        data: department,
    });

}
export const getDepartmentByIdController = () => {

}
export const getDepartmentsController = () => {

}
export const updateDepartmentController = () => {

}
export const assignDepartmentManagerController = () => {

}
export const deactiveDepartmentController = () => {

}