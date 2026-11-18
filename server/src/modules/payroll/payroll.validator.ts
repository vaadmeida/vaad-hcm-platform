import { MonthlyPayrollStatus } from "@prisma/client";
import { z } from "zod";

export const preparePayrollSchema = z.object({
    month: z.coerce.number()
        .int("Month must be a whole number")
        .min(1, "Month must be between 1 and 12")
        .max(12, "Month must be between 1 and 12"),

    year: z.coerce.number()
        .int("Year must be a whole number")
        .min(2000, "Invalid payroll year")
        .max(2100, "Invalid payroll year"),
});


export const getPayrollsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(7),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
    status: z.nativeEnum(MonthlyPayrollStatus).optional(),
    search: z.string().trim().optional(),
});