import { Response, NextFunction } from "express";
import { IAuthRequest } from "../interface/common";
import ApiError from "../errors/ApiError";
import { verifyToken } from "../utils/jwt.util";

export const auth = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided. Please login.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token as string);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Token expired. Please login again."));
    } else {
      next(error);
    }
  }
};
