import { z } from "zod";

// Signup  
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

// Email Verification  
export const verifyEmailSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

// Login  
export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Set Location  
export const setLocationSchema = z.object({
  location: z.string().min(1, "Location is required"),
});

//  Social Login   
export const socialLoginSchema = z.object({
  orgSlug: z.string().min(1, "Organization Slug is required"),
  provider: z.enum(["google", "apple"]),
  token: z.string().min(1, "Token is required"),
});

//  Password Reset Flow  
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email"),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  code: z.string().min(6).max(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email"),
  code: z.string().min(6).max(6),
  newPassword: z.string().min(6).max(32),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});
