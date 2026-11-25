import prisma from "../../config/prisma.ts";
import { signPayslipDownload, uploadFileToS3 } from "../../config/storage.ts";
import { AppError } from "../../errors/appError.ts";
import { GeneratePayrollPayslipsResult } from "./payslips.types.ts";
import { renderPayslipPdf } from "./render-payslip-pdf.ts";

export const generatePayrollPayslips = async (
    payrollId: string
): Promise<GeneratePayrollPayslipsResult> => {
    const payroll = await prisma.monthlyPayroll.findUnique({
        where: { id: payrollId },
        select: {
            id: true,
            month: true,
            year: true,
            status: true,
        },
    });

    if (!payroll) {
        throw new AppError(
            "Payroll period not found.",
            404,
            "PAYROLL_NOT_FOUND"
        );
    }

    if (payroll.status !== "PROCESSED") {
        throw new AppError(
            "Only processed payrolls can generate payslips.",
            409,
            "PAYROLL_NOT_PROCESSED"
        );
    }

    const employees = await prisma.monthlyPayrollEmployee.findMany({
        where: { payrollId },
        include: {
            components: true,
            earnings: true,
            payslip: {
                select: { storageKey: true },
            },
        },
        orderBy: { id: "asc" },
    });

    for (const employee of employees) {
        if (employee.payslip?.storageKey) continue;

        const pdf = await renderPayslipPdf({
            month: payroll.month,
            year: payroll.year,
            employeeName: employee.employeeName,
            employeeNumber: employee.employeeNumber,
            departmentNames: employee.departmentNames,
            components: employee.components.map((component) => ({
                label: component.name,
                amount: component.monthlyAmount.toFixed(2),
            })),
            earnings: employee.earnings.map((earning) => ({
                label: earning.name,
                amount: earning.amount.toFixed(2),
            })),
            monthlyGross: employee.monthlyGross.toFixed(2),
            grossPay: employee.grossPay.toFixed(2),
            paye: employee.paye.toFixed(2),
            otherDeductions: employee.otherDeductions.toFixed(2),
            netPay: employee.netPay.toFixed(2),
        });

        const fileName = `${employee.id}.pdf`;
        const storageKey = `payslips/${payroll.id}/${fileName}`;
        const mimeType = "application/pdf";

        await uploadFileToS3(storageKey, pdf, mimeType);

        const fileData = {
            fileName,
            storageKey,
            mimeType,
            generatedAt: new Date(),
            failureReason: null,
        };

        await prisma.payslip.upsert({
            where: { payrollEmployeeId: employee.id },
            create: {
                payrollEmployeeId: employee.id,
                ...fileData,
            },
            update: fileData,
        });
    }

    return {
        payrollId: payroll.id,
        totalEmployees: employees.length,
        readyCount: employees.length,
    };
};


import type { Prisma } from "@prisma/client";

type ListPayrollPayslipsParams = {
    page: number;
    limit: number;
    search: string;
};

export const listPayrollPayslips = async (
    payrollId: string,
    { page, limit, search }: ListPayrollPayslipsParams
) => {
    const payroll = await prisma.monthlyPayroll.findUnique({
        where: { id: payrollId },
        select: { id: true, month: true, year: true },
    });

    if (!payroll) {
        throw new AppError(
            "Payroll period not found.",
            404,
            "PAYROLL_NOT_FOUND"
        );
    }

    const where: Prisma.MonthlyPayrollEmployeeWhereInput = {
        payrollId,
        payslip: { is: { storageKey: { not: null } } },
        ...(search && {
            OR: [
                { employeeName: { contains: search, mode: "insensitive" } },
                { employeeNumber: { contains: search, mode: "insensitive" } },
            ],
        }),
    };

    const [employees, total] = await prisma.$transaction(
        [
            prisma.monthlyPayrollEmployee.findMany({
                where,
                orderBy: [{ employeeName: "asc" }, { id: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    employeeName: true,
                    employeeNumber: true,
                    departmentNames: true,
                    netPay: true,
                    payslip: {
                        select: {
                            id: true,
                            fileName: true,
                            generatedAt: true,
                        },
                    },
                },
            }),
            prisma.monthlyPayrollEmployee.count({ where }),
        ],
        { isolationLevel: "RepeatableRead" }
    );

    const payslips = employees.flatMap(({ payslip, ...employee }) =>
        payslip
            ? [{
                  payslipId: payslip.id,
                  fileName: payslip.fileName,
                  generatedAt: payslip.generatedAt,
                  ...employee,
              }]
            : []
    );

    return {
        payroll,
        payslips,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getPayslipDownload = async (payslipId: string) => {
    const payslip = await prisma.payslip.findUnique({
        where: { id: payslipId },
        select: { id: true, storageKey: true },
    });

    if (!payslip) {
        throw new AppError("Payslip not found.", 404, "PAYSLIP_NOT_FOUND");
    }

    if (!payslip.storageKey) {
        throw new AppError(
            "The payslip PDF has not been generated.",
            409,
            "PAYSLIP_NOT_READY"
        );
    }

    return {
        payslipId: payslip.id,
        downloadUrl: await signPayslipDownload(payslip.storageKey, payslip.id),
        expiresIn: 300,
    };
};