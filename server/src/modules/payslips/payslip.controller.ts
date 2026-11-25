import type { Request, Response } from "express";

import { AppError } from "../../errors/appError.ts";
import { generatePayrollPayslips, getPayslipDownload, listPayrollPayslips } from "./payslip.service.ts";



export const generatePayrollPayslipsController = async (
    req: Request,
    res: Response
) => {
    const { payrollId } = req.params;

    if (typeof payrollId !== "string") {
        throw new AppError("Invalid payroll ID.", 400, "INVALID_PAYROLL_ID");
    }

    const result = await generatePayrollPayslips(payrollId);

    return res.status(200).json({
        success: true,
        message:
            result.readyCount > 0
                ? "Payroll payslips are ready."
                : "This payroll has no employees to generate payslips for.",
        data: result,
    });
};

export const listPayrollPayslipsController = async (
    req: Request,
    res: Response
) => {
    const { payrollId } = req.params;

    if (typeof payrollId !== "string") {
        throw new AppError("Invalid payroll ID.", 400, "INVALID_PAYROLL_ID");
    }

    const { page: rawPage = "1", limit: rawLimit = "25", search = "" } = req.query;

    if (
        typeof rawPage !== "string" ||
        !/^[1-9]\d*$/.test(rawPage) ||
        typeof rawLimit !== "string" ||
        !/^[1-9]\d*$/.test(rawLimit) ||
        typeof search !== "string"
    ) {
        throw new AppError(
            "Invalid payslip filters.",
            400,
            "INVALID_PAYSLIP_FILTERS"
        );
    }

    const page = Number(rawPage);
    const limit = Number(rawLimit);

    if (limit > 100 || (page - 1) * limit > 2_147_483_647) {
        throw new AppError(
            "Pagination is out of range. The maximum limit is 100.",
            400,
            "INVALID_PAYSLIP_FILTERS"
        );
    }

    const result = await listPayrollPayslips(payrollId, {
        page,
        limit,
        search: search.trim(),
    });

    return res.status(200).json({
        success: true,
        message: "Payroll payslips retrieved successfully.",
        data: result,
    });
};


export const downloadPayslipController = async (req: Request, res: Response) => {
    const { payslipId } = req.params;

    if (typeof payslipId !== "string") {
        throw new AppError("Invalid payslip ID.", 400, "INVALID_PAYSLIP_ID");
    }

    const result = await getPayslipDownload(payslipId);

    return res
        .set("Cache-Control", "private, no-store")
        .status(200)
        .json({
            success: true,
            message: "Payslip download link created.",
            data: result,
        });
};