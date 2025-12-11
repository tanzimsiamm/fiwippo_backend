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
  iat?: number;
  exp?: number;
}

export interface IAuthRequest {
  headers: any;
  user?: {
    userId: string;
    email: string;
  };
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorMessages?: Array<{ path: string; message: string }>;
  stack?: string;
}
