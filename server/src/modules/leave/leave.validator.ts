import { z } from 'zod'

export const CreateLeaveTypeSchema = z.object({
  name: z.string().min(2),
  default_days_per_year: z.number().min(2).optional(),
  is_paid: z.boolean().optional(),
  requires_document: z.boolean().optional(),
  carries_over: z.boolean().optional(),
  max_carryover_days: z.number().optional()
})

export const getLeaveSchema = z.object({
  id: z.uuid("Invalid employee ID"),
});

export const getLeaveBalanceParamsSchema = z.object({
  id: z.uuid("Invalid employee ID"),
});

export const getLeaveRequestSchema = z.object({
  employee_id: z.uuid("Invalid employee ID").optional(),
  status: z
    .enum([
      "pending",
      "approved",
      "rejected",
    ])
    .optional(),
});

export const submitRequestSchema = z.object({
  leave_type_id: z.uuid(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  reason: z.string().min(10, "Reason must be at least 10 characters")
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