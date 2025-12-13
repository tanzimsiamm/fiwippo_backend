import { UserRole } from "@prisma/client";

export interface SignUpRequest {
  orgSlug: string; // Required to link user to the correct Organization
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  termsAccepted: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SetLocationRequest {
  userId: string;
  location: string;
}

export interface SocialLoginRequest {
  orgSlug: string; // Required
  provider: "google" | "apple";
  token: string;
}

// Response Interfaces
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    isEmailVerified: boolean;
    organizationId: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SignUpResponse {
  userId: string;
  email: string;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    isEmailVerified: boolean;
  };
}
