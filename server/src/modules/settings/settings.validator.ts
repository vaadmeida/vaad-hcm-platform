import { z } from "zod";

export const updateMyProfileValidator = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  middle_name: z
    .string()
    .trim()
    .min(2, "Middle name must be at least 2 characters")
    .max(50, "Middle name must not exceed 50 characters")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .regex(
      /^(\+234|0)[789][01]\d{8}$/,
      "Please provide a valid Nigerian phone number"
    )
    .optional()
    .or(z.literal("")),

  job_title: z
    .string()
    .trim()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
});


export const updateOrganizationValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must not exceed 255 characters")
    .optional(),

  industry: z
    .string()
    .trim()
    .max(100, "Industry must not exceed 100 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please provide a valid company email")
    .max(255, "Email must not exceed 255 characters")
    .optional(),

  company_size: z
    .string()
    .trim()
    .max(50, "Company size must not exceed 50 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number must not exceed 20 characters")
    .optional(),

  website: z
    .string()
    .trim()
    .url("Please provide a valid website URL")
    .max(255, "Website must not exceed 255 characters")
    .optional(),

  street_address: z
    .string()
    .trim()
    .max(255, "Street address must not exceed 255 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City must not exceed 100 characters")
    .optional(),

  state: z
    .string()
    .trim()
    .max(100, "State must not exceed 100 characters")
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, "Country must not exceed 100 characters")
    .optional(),
});

export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationValidator
>;
