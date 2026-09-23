import { Request, Response } from "express";
import { createEmployeeSalary, getEmployeeSalary } from "./salary.service.ts";
import { AppError } from "../../errors/appError.ts";
import { createSalarySchema } from "./salary.validator.ts";

export const getEmployeeSalaryController = async (
    req: Request,
    res: Response
) => {
    const { employeeId } = req.params;

    if (typeof employeeId !== "string") {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }


    const salary = await getEmployeeSalary(employeeId);

    return res.status(200).json({
        success: true,
        message: "Employee salary retrieved successfully.",
        data: salary,
    });
};

export const getMySalaryController = async (
    req: Request,
    res: Response
) => {
    const employeeId = req.user?.id;


    if (typeof employeeId !== "string") {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    const salary = await getEmployeeSalary(employeeId);

    return res.status(200).json({
        success: true,
        message: "Salary retrieved successfully.",
        data: salary,
    });
};


export const createEmployeeSalaryController = async (
    req: Request,
    res: Response
) => {

    const { employeeId } = req.params;

    if (typeof employeeId !== "string") {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    const validation = createSalarySchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(
            "Invalid salary data.",
            400,
            "INVALID_SALARY_DATA"
        );
    }

    const salary = await createEmployeeSalary(
        employeeId,
        validation.data
    );

    return res.status(201).json({
        success: true,
        message: "Employee salary created successfully.",
        data: salary,
    });
};

