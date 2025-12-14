import { Request, Response } from "express";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import { sendSuccessResponse } from "../../utils/SendResponse";
import { IAuthRequest } from "../../interface/common";

// Signup
const signUp = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signUp(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: result.message,
    data: result,
  });
});

// Email Verification
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyEmail(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
    data: result,
  });
});

// Set Location
const setLocation = catchAsync(async (req: IAuthRequest, res: Response) => {
  const result = await authServices.setLocation({
    userId: req.user!.userId,
    location: req.body.location,
  });

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Location set successfully",
    data: result,
  });
});

//  Login
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.login(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result,
  });
});

// Social Login
const socialLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.socialLogin(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Social login successful",
    data: result,
  });
});

//  Password Reset Flow
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.forgotPassword(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

const verifyResetOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyResetOtp(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP verified successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.resetPassword(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
    data: null,
  });
});

// Export
export const authController = {
  signUp,
  verifyEmail,
  setLocation,
  login,
  socialLogin,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
