import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
