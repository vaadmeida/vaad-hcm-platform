import  { z } from 'zod'

export const loginSchema = z.object({
    email: z.email("Please Enter a valid Email address.").trim(),
    password: z.string("Please Enter a Password.").min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),
})

export type LoginFormData = z.infer<typeof loginSchema>
