import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../config";
import { GenerateTokenOptions, IJwtPayload, TokenType } from "../interface/common";

/* -------------------------------------------------------------------------- */
/*                              Core Generators                               */
/* -------------------------------------------------------------------------- */

export const generateToken = (
  payload: Omit<IJwtPayload, "iat" | "exp">,
  options: GenerateTokenOptions = { type: "access" }
): string => {
  const type = options.type ?? "access";

  const secret =
    type === "access"
      ? config.jwt.accessSecret
      : config.jwt.refreshSecret;

  const expiresIn =
    options.expiresIn ??
    (type === "access"
      ? config.jwt.accessExpiresIn
      : config.jwt.refreshExpiresIn);

  const signOptions: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, signOptions);
};

/**
 * Generates both access & refresh tokens together
 * Recommended for login / verify email / social login
 */
export const generateTokenPair = (
  payload: Omit<IJwtPayload, "iat" | "exp">
): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateToken(payload, { type: "access" }),
    refreshToken: generateToken(payload, { type: "refresh" }),
  };
};

/* -------------------------------------------------------------------------- */
/*                                Verification                                */
/* -------------------------------------------------------------------------- */

export const verifyToken = (
  token: string,
  type: TokenType = "access"
): IJwtPayload => {
  const secret =
    type === "access"
      ? config.jwt.accessSecret
      : config.jwt.refreshSecret;

  return jwt.verify(token, secret) as IJwtPayload;
};

/**
 * Safe verification (returns null instead of throwing)
 * Useful for guards & middleware
 */
export const verifyTokenSafe = (
  token: string,
  type: TokenType = "access"
): IJwtPayload | null => {
  try {
    return verifyToken(token, type);
  } catch {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                                  Decoding                                  */
/* -------------------------------------------------------------------------- */

/**
 * Decode without verifying signature
 * DO NOT use for authorization decisions
 */
export const decodeToken = (token: string): IJwtPayload | null => {
  return jwt.decode(token) as IJwtPayload | null;
};
