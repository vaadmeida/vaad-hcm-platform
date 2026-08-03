import { Request, Response } from "express"
import { createDepartmentSchema } from "./department.validator.ts"
import { createDepartment, getDepartmentById, getDepartments } from "./department.service.ts";

export const createDepartmentController = async (req: Request, res: Response) => {

    const parsed =  createDepartmentSchema.parse(req.body)

    const department = await createDepartment(parsed);
    
    return res.status(201).json({
        success: true,
        message: "Department created successfully.",
        data: department,
    });

}
export const getDepartmentByIdController = async (req: Request, res: Response) => {

    const id = req.params.id as string;
  const department = await getDepartmentById(id, req.user!);

  return res.status(200).json({
    success: true,
    message: "Department retrieved successfully.",
    data: department,
  });
}

export const getDepartmentController = async (req: Request,res: Response) => {

     const departments = await getDepartments(req.user!);

    return res.status(200).json({
        success: true,
        message: "Departments retrieved successfully.",
        data: departments,
    });

};

export const updateDepartmentController = () => {

}
export const assignDepartmentManagerController = () => {

}
export const deactiveDepartmentController = () => {

}