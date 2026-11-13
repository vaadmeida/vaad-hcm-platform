import { z } from 'zod'

export const CreateLeaveTypeSchema = z.object({
  name: z.string().min(2),
  is_paid: z.boolean().optional(),
  requires_document: z.boolean().optional(),
  carries_over: z.boolean().optional(),
  default_days_per_year: z.number().nullish(),
  max_carryover_days: z.number().nullish(),
})

export const getLeaveSchema = z.object({
  id: z.uuid("Invalid employee ID"),
});

export const getLeaveBalanceParamsSchema = z.object({
  id: z.uuid("Invalid employee ID"),
});
export const employeeIdParamsSchema = z.object({
  id: z.string().min(1),
});


export const getLeaveRequestSchema = z.object({
  employee_id: z.uuid("Invalid employee ID").optional(),
  status: z
    .enum([
      "pending",
      "approved",
      "rejected",
      "cancelled",
    ])
    .optional(),
  search: z.string().trim().optional(),
  leave_type_id: z.uuid("Invalid leave type ID").optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(7),
});


export const submitRequestSchema = z.object({
  leave_type_id: z.uuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().min(10, "Reason must be at least 10 characters").optional()
})

export const approveOrRejectParamsSchema = z.object({
  id: z.uuid("Invalid leave request ID"),
});

export const approveOrRejectSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("APPROVE"),
  }),

  z.object({
    action: z.literal("REJECT"),
    rejectionReason: z
      .string()
      .trim()
      .min(1, "Rejection reason is required."),
  }),
]);

export const cancelLeaveRequestParamsSchema = z.object({
  id: z.uuid("Invalid leave request ID"),
});


export const updateLeaveTypeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Leave type name must be at least 3 characters.")
      .optional(),

    is_paid: z.boolean().optional(),

    carries_over: z.boolean().optional(),

    requires_document: z.boolean().optional(),

    max_carryover_days: z
      .number()
      .int()
      .min(0, "Maximum carryover days cannot be negative.")
      .nullable()
      .optional(),

    default_days_per_year: z
      .number()
      .int()
      .min(0, "Default days per year cannot be negative.")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update.",
    }
  )
  .refine(
    (data) =>
      !(data.is_paid === false && data.carries_over === true),
    {
      message: "Unpaid leave cannot carry over days.",
      path: ["carries_over"],
    }
  )
  .refine(
    (data) =>
      !(
        data.carries_over === false &&
        (data.max_carryover_days ?? 0) > 0
      ),
    {
      message:
        "Maximum carryover days must be 0 when carryover is disabled.",
      path: ["max_carryover_days"],
    }
  );
  