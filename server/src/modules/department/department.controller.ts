import { Request, Response } from "express"
import { assignDepartmentManagerSchema, createDepartmentSchema, updateDepartmentSchema } from "./department.validator.ts"
import { assignDepartmentManager, createDepartment, getDepartmentById, getDepartments, getDepartmentStats, removeDepartmentManager, removeDepartmentManager as removeDepartmentManagerService, teamMembers, teamRecentActivities, updateDepartment } from "./department.service.ts";
import { AppError } from "../../errors/appError.ts";

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

    const parsed =  updateDepartmentSchema.safeParse(req.body)

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

    const updated = await assignDepartmentManager({
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
export const teamMembersController = async (req: Request, res: Response) => {

    const departmentId = req.params.id as string;

    if (!departmentId) {
        throw new AppError(
            "Department ID is required",
            400,
            "BAD_REQUEST"
        );
    }

    const employees = await teamMembers(departmentId)

    return res.status(200).json({
        success: true,
        message: "Team members retrieved successfully.",
        data: employees,
    });


}



export const removeDepartmentManagerController = async (req: Request, res: Response) => {

    console.log("PARAMS:", req.params);
    console.log("DEPARTMENT ID:", req.params.departmentId);

    const { departmentId } = req.params

    if (Array.isArray(departmentId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid department ID.",
        });
    }

    await removeDepartmentManager(departmentId, req.user!)

    return res.status(200).json({
        success: true,
        message: "Manager Removed successfully.",
    });

}

export const teamRecentActivitiesController = async (req: Request, res: Response) => {

    const { departmentId } = req.params

    const recentAct = await teamRecentActivities(departmentId as string)


    return res.status(200).json({
        success: true,
        message: "Team recent activities retrieved successfully.",
        data: recentAct,
    });
}

export const getDepartmentStatsController = async (req: Request, res: Response) => {


    const { departmentId } = req.params

    const departmentStats = await getDepartmentStats(departmentId as string)

        return res.status(200).json({
        success: true,
        message: "Team recent activities retrieved successfully.",
        data: departmentStats,
    });

}