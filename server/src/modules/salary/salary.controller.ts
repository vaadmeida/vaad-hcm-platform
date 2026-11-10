import { Request, Response } from "express";
import { createEmployeeSalary, EmployeeSalaryReview, getEmployeeSalary, getEmployeeSalaryHistory, getEmployeesWithSalary } from "./salary.service.ts";
import { AppError } from "../../errors/appError.ts";
import { createSalarySchema, salaryReviewSchema } from "./salary.validator.ts";
import z from "zod";


export const getAllEmployeesSalaryController = async (
    req: Request,
    res: Response
) => {
    const page = Math.max(1, Number(req.query.page) || 1);

    const result = await getEmployeesWithSalary({
        page,
        search: String(req.query.search ?? ""),
        department: String(req.query.department ?? "all"),
        salaryStatus: String(req.query.salaryStatus ?? "all"),
    });

    res.status(200).json({
        success: true,
        ...result,
    });
};


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

    const employeeIdValidation = z.string().uuid().safeParse(employeeId);

    if (!employeeIdValidation.success) {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    const validation = createSalarySchema.safeParse(req.body);

    if (!validation.success) {
        console.error(
            "Salary validation errors:",
            JSON.stringify(validation.error.flatten(), null, 2)
        );

        throw new AppError(
            "Invalid salary data.",
            400,
            "INVALID_SALARY_DATA",
            validation.error.flatten()
        );
    }
    const salary = await createEmployeeSalary(
        employeeIdValidation.data,
        validation.data
    );

    return res.status(201).json({
        success: true,
        message: "Employee salary created successfully.",
        data: salary,
    });
};

export const EmployeeSalaryReviewController = async (
    req: Request,
    res: Response
) => {
    const { employeeId } = req.params;

    // 1. Validate employee ID.
    const employeeIdValidation = z.string().uuid().safeParse(employeeId);

    if (!employeeIdValidation.success) {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    // 2. Validate salary review data.
    const result = salaryReviewSchema.safeParse(req.body);

    if (!result.success) {
        console.error(
            "Salary review validation errors:",
            result.error.flatten()
        );

        throw new AppError(
            "Invalid salary review data.",
            400,
            "INVALID_SALARY_REVIEW_DATA",
            result.error.flatten()
        );
    }

    // 3. Process salary review.
    const salary = await EmployeeSalaryReview(
        employeeIdValidation.data,
        result.data
    );

    // 4. Return newly created salary structure.
    return res.status(201).json({
        success: true,
        message: "Employee salary reviewed successfully.",
        data: salary,
    });
};


export const getEmployeeSalaryHistoryController = async (
    req: Request,
    res: Response
) => {
    const { employeeId } = req.params;
    const user = req.user;

    if (!user) {
        throw new AppError(
            "Unauthorized.",
            401,
            "UNAUTHORIZED"
        );
    }

    if (typeof employeeId !== "string") {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    const validation = z.string().uuid().safeParse(employeeId);

    if (!validation.success) {
        throw new AppError(
            "Invalid employee ID.",
            400,
            "INVALID_EMPLOYEE_ID"
        );
    }

    if (
        user.role === "employee" &&
        user.id !== employeeId
    ) {
        throw new AppError(
            "You are not authorized to view this salary history.",
            403,
            "FORBIDDEN"
        );
    }

    const salaryHistory = await getEmployeeSalaryHistory(employeeId);

    res.status(200).json({
        success: true,
        message: "Employee salary history retrieved successfully.",
        data: salaryHistory,
    });
};