import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
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

export const setLocationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  location: z.string().min(1, "Location is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const socialLoginSchema = z.object({
  provider: z.enum(["google", "apple"]),
  token: z.string().min(1, "Token is required"),
});
