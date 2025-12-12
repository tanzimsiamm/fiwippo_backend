// auth.interface.ts
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface SetLocationRequest {
  userId: string;
  location: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SocialLoginRequest {
  provider: "google" | "apple";
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string | undefined;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
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
  user?: User;
}

export interface SetLocationResponse {
  success: boolean;
  user: User;
}
