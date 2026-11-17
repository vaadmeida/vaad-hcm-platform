import { Request, Response } from "express";
import { AppError } from "../../errors/appError.ts";
import { getPayrollsQuerySchema, preparePayrollSchema } from "./payroll.validator.ts";
import { approvePayroll, calculateMonthlyPayroll, getPayrollById, getPayrolls, preparePayroll, reviewPayroll } from "./payslip.service.ts";

export const preparePayrollController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;

    if (typeof userId !== "string") {
        throw new AppError(
            "Unauthorized.",
            401,
            "UNAUTHORIZED"
        );
    }

    const validation = preparePayrollSchema.safeParse(req.body);

    if (!validation.success) {
        throw new AppError(
            "Invalid payroll period.",
            400,
            "INVALID_PAYROLL_PERIOD",
            validation.error.flatten()
        );
    }

    const payroll = await preparePayroll(
        validation.data,
        userId
    );

    return res.status(201).json({
        success: true,
        message: "Payroll period prepared successfully.",
        data: payroll,
    });
};

export const calculatePayrollController = async (
    req: Request,
    res: Response
) => {
    const { payrollId } = req.params;

    if (typeof payrollId !== "string") {
        throw new AppError(
            "Invalid payroll ID.",
            400,
            "INVALID_PAYROLL_ID"
        );
    }

    if (!payrollId) {
        throw new AppError(
            "Payroll ID is required.",
            400,
            "PAYROLL_ID_REQUIRED"
        );
    }

    const payroll = await calculateMonthlyPayroll(payrollId);

    return res.status(200).json({
        success: true,
        message: "Monthly payroll calculated successfully.",
        data: payroll,
    });
};

export const getPayrollByIdController = async (
    req: Request,
    res: Response,
) => {

    const { payrollId } = req.params;

    if (typeof payrollId !== "string") {
        throw new AppError(
            "Invalid payroll ID.",
            400,
            "INVALID_PAYROLL_ID"
        )
    }

    const payroll = await getPayrollById(payrollId);

    res.status(200).json({
        success: true,
        message: "Payroll retrieved successfully.",
        data: { payroll },
    });
};


export const getPayrollsController = async (
    req: Request,
    res: Response,
) => {

    const query = getPayrollsQuerySchema.parse(req.query);

    const result = await getPayrolls(query);

    res.status(200).json({
        success: true,
        message: "Payrolls retrieved successfully.",
        data: result,
    });
}


export const reviewPayrollController = async (
    req: Request,
    res: Response,
) => {
      const { payrollId } = req.params;

        if (typeof payrollId !== "string") {
            throw new AppError(
                "Invalid payroll ID.",
                400,
                "INVALID_PAYROLL_ID"
            )
        }

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "Unauthorized. User information is missing.",
                401,
                "UNAUTHORIZED"
            );
        }

        const payroll = await reviewPayroll(payrollId, userId);

        res.status(200).json({
            success: true,
            message: "Payroll reviewed successfully.",
            data: { payroll },
        });
};

export const approvePayrollController = async (
    req: Request,
    res: Response,

) => {


     const { payrollId } = req.params;

        if (typeof payrollId !== "string") {
            throw new AppError(
                "Invalid payroll ID.",
                400,
                "INVALID_PAYROLL_ID"
            )
        }

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "Unauthorized. User information is missing.",
                401,
                "UNAUTHORIZED"
            );
        }

    const payroll = await approvePayroll(payrollId,userId);

    res.status(200).json({
        success: true,
        message: "Payroll approved successfully.",
        data: { payroll },
    });
};