import { Request, Response } from "express"
import { assignDepartmentManagerSchema, createDepartmentSchema, updateDepartmentSchema } from "./department.validator.ts"
import { assignDepartmentManager, createDepartment, getDepartmentById, getDepartments, updateDepartment } from "./department.service.ts";

export const createDepartmentController = async (req: Request, res: Response) => {

    const parsed = createDepartmentSchema.parse(req.body)

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

export const getDepartmentController = async (req: Request, res: Response) => {

    const departments = await getDepartments(req.user!);

    return res.status(200).json({
        success: true,
        message: "Departments retrieved successfully.",
        data: departments,
    });

};

export const updateDepartmentController = async (req: Request, res: Response) => {

    const parsed = await updateDepartmentSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
    }

    const updated = await updateDepartment({
        id: req.params.id as string,
        data: parsed.data,
        user: req.user!
    }
    )

    return res.status(200).json({
        success: true,
        message: "Department updated successfully",
        data: updated,
    });

}
export const assignDepartmentManagerController = async (req: Request, res: Response) => {

    const parsed = assignDepartmentManagerSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
    }

    const updated  = await assignDepartmentManager({
        id: req.params.id as string,
        user: req.user!,
        data: parsed.data
    })

    return res.status(200).json({
        success: true,
        message: "Department manager assigned successfully",
        data: updated,
    });

}
export const teamMembersController = () => {

}