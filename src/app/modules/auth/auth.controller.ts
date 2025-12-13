import { Request, Response } from "express";
import httpStatus from "http-status";
import { authServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import { sendSuccessResponse } from "../../utils/SendResponse";

const signUp = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signUp(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.CREATED,
    message: result.message,
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.verifyEmail(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: result.message,
    data: result,
  });
});

const setLocation = catchAsync(async (req: Request, res: Response) => {
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

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.login(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful",
    data: result,
  });
});

const socialLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.socialLogin(req.body);

  sendSuccessResponse(res, {
    statusCode: httpStatus.OK,
    message: "Social login successful",
    data: result,
  });
});

export const authController = {
  signUp,
  verifyEmail,
  setLocation,
  login,
  socialLogin,
};
