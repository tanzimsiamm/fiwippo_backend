import { UserRole } from "@prisma/client";
import { Request } from "express";

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null | undefined;
  error?: string | undefined;
  errors?: Array<{ path: string; message: string; }> | undefined;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  organizationId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface IAuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    organizationId: string;
    role: UserRole;
  };
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorMessages?: Array<{ path: string; message: string }>;
  stack?: string;
}