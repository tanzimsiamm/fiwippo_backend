import { z } from "zod";

export const signUpSchema = z
  .object({
    orgSlug: z.string().min(1, "Organization Slug is required"),
    name: z.string().optional(),
    email: z.string().email("Please provide a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password cannot exceed 32 characters"),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  code: z.string().min(6).max(6),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const setLocationSchema = z.object({
  location: z.string().min(1, "Location is required"),
});

export const socialLoginSchema = z.object({
  orgSlug: z.string().min(1, "Organization Slug is required"),
  provider: z.enum(["google", "apple"]),
  token: z.string().min(1, "Token is required"),
});