import jwt from "jsonwebtoken";
import config from "../config";
import { IJwtPayload } from "../interface/common";

export const generateToken = (
  payload: Omit<IJwtPayload, "iat" | "exp">,
  type: "access" | "refresh" = "access"
): string => {
  const secret =
    type === "access"
      ? config.jwt.accessSecret
      : config.jwt.refreshSecret;

  const expiresIn =
    type === "access"
      ? config.jwt.accessExpiresIn
      : config.jwt.refreshExpiresIn;

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access"
): IJwtPayload => {
  const secret =
    type === "access"
      ? config.jwt.accessSecret
      : config.jwt.refreshSecret;

  return jwt.verify(token, secret) as IJwtPayload;
};

export const decodeToken = (token: string): IJwtPayload | null => {
  return jwt.decode(token) as IJwtPayload | null;
};
