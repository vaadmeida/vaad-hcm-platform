import { Request, Response } from "express";
import { createEmployee, deactivateEmployee, getAllEmployees, getEmployee, updateEmployee } from "./employee.service.ts"
import { AppError } from "../../errors/appError.ts";
import { createEmployeeSchema, getAllEmployeesSchema, getEmployeeSchema, updateEmployeeSchema } from "./employee.validator.ts";


export const createEmployeeController = async (req: Request, res: Response) => {

    const parsed = createEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(
            "Validation failed",
            400,
            "VALIDATION_ERROR",
            parsed.error.flatten()
        );
    }

    const result = await createEmployee({
        ...parsed.data,
        hire_date: parsed.data.hire_date
            ? new Date(parsed.data.hire_date)
            : undefined,
    });

    return res.status(201).json({
        success: true,
        message: "Employee created successfully",
        data: result.user,
    });
};


export const getEmployeeController = async (req: Request, res: Response) => {
    const parsed = getEmployeeSchema.safeParse(req.params);

    if (!parsed.success) {
        throw new AppError("Invalid employee ID", 400, "VALIDATION_ERROR");
    }

    const user = req.user;

    if (!user) {
        throw new AppError("Unauthorized", 401, "NO_USER");
    }

    const employee = await getEmployee(parsed.data.id, user);
    

    return res.status(200).json({
        success: true,
        data: employee,
    });
};

export const getAllEmployeesController = async (req: Request,res: Response) => {
    
    const parsed = getAllEmployeesSchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: parsed.error.flatten(),
        });
    }

    const user = req.user;

    if (!user) {
        throw new AppError("Unauthorized", 401, "NO_USER");
    }

    const employees = await getAllEmployees(user, parsed.data);

    return res.status(200).json({
        success: true,
        count: employees.length,
        data: employees,
    });
};

export const updateEmployeeController = async (
    req: Request,
    res: Response
) => {
    const parsed = updateEmployeeSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten(),
        });
    }

    const updated = await updateEmployee({
        id: req.params.id as string,
        data: parsed.data,
        user: req.user!,
    });

    return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: updated,
    });
};

export const deactivateEmployeeController = async (req: Request, res: Response) => {

    if (!req.user) {
        throw new AppError("Unauthorized", 401, "NO_USER");
    }

    const { id } = req.params;

    if (typeof id !== "string") {
        throw new AppError("Invalid employee ID", 400, "INVALID_ID");
    }

    const result = await deactivateEmployee(id, req.user);

    return res.status(200).json({
        success: true,
        message: "Employee deactivated successfully",
        data: result,
    });
}


