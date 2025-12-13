import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { generateTokenPair } from "../../utils/jwt.util";
import { hashPassword, comparePassword } from "../../utils/bcrypt.util";
import {
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  AuthResponse,
  SocialLoginRequest,
  SetLocationRequest,
  ForgotPasswordRequest,
  VerifyResetOtpRequest,
  ResetPasswordRequest,
} from "./auth.interface";
import { buildAuthPayload, generateVerificationCode, sendPasswordResetEmail, sendVerificationEmail } from "../../helpers";

/* -------------------------------------------------------------------------- */
/*                                   Services                                 */
/* -------------------------------------------------------------------------- */

const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const email = data.email.toLowerCase().trim();

  const organization = await prisma.organization.findUnique({
    where: { slug: data.orgSlug },
  });

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  const passwordHash = await hashPassword(data.password);
  const verificationCode = generateVerificationCode();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

  const user = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: data.name || null,
      email,
      passwordHash,
      role: "USER",
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpiry,
    },
  });

  await sendVerificationEmail(email, verificationCode);

  return {
    userId: user.id,
    email: user.email,
    message: "Verification code sent to your email",
  };
};

const verifyEmail = async (
  data: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (user.isEmailVerified)
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");

  if (
    !user.verificationCode ||
    !user.verificationCodeExpiry ||
    user.verificationCodeExpiry < new Date()
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Verification code expired");
  }

  if (user.verificationCode !== data.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid verification code");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    },
  });

  const payload = buildAuthPayload(updatedUser);
  const { accessToken, refreshToken } = generateTokenPair(payload);

  await prisma.user.update({
    where: { id: updatedUser.id },
    data: { refreshTokenHash: await hashPassword(refreshToken) },
  });

  return {
    success: true,
    message: "Email verified successfully",
    token: accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      isEmailVerified: updatedUser.isEmailVerified,
    },
  };
};

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Please verify your email first");
  }

  const isValid = await comparePassword(data.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const payload = buildAuthPayload(user);
  const { accessToken, refreshToken } = generateTokenPair(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: await hashPassword(refreshToken) },
  });

  return {
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      organizationId: user.organizationId,
    },
  };
};

/* ------------------------------ Social Login ------------------------------ */

const socialLogin = async (data: SocialLoginRequest): Promise<AuthResponse> => {
  const organization = await prisma.organization.findUnique({
    where: { slug: data.orgSlug },
  });

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
  }

  // TODO: verify provider token (Google / Apple)
  const socialUser = {
    email: "social-mock@example.com",
    name: "Social User",
  };

  const email = socialUser.email.toLowerCase().trim();

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        organizationId: organization.id,
        email,
        name: socialUser.name,
        role: "USER",
        isEmailVerified: true,
        provider: data.provider,
        passwordHash: null,
      },
    });
  }

  const payload = buildAuthPayload(user);
  const { accessToken, refreshToken } = generateTokenPair(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: await hashPassword(refreshToken) },
  });

  return {
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      organizationId: user.organizationId,
    },
  };
};

/* ------------------------------ Set Location ------------------------------ */

const setLocation = async (data: SetLocationRequest) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  return prisma.user.update({
    where: { id: data.userId },
    data: { location: data.location },
  });
};

/* --------------------------- Password Reset Flow --------------------------- */

const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<{ message: string }> => {
  const email = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "User with this email does not exist");

  if (user.provider && user.provider !== "email") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This account uses ${user.provider} login`
    );
  }

  const code = generateVerificationCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetCode: code,
      passwordResetExpiry: expiry,
    },
  });

  await sendPasswordResetEmail(email, code);

  return { message: "Password reset code sent to your email" };
};

const verifyResetOtp = async (
  data: VerifyResetOtpRequest
): Promise<{ isValid: boolean }> => {
  const email = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  if (
    !user.passwordResetCode ||
    !user.passwordResetExpiry ||
    user.passwordResetExpiry < new Date()
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reset code expired");
  }

  if (user.passwordResetCode !== data.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid reset code");
  }

  return { isValid: true };
};

const resetPassword = async (
  data: ResetPasswordRequest
): Promise<{ message: string }> => {
  if (data.newPassword !== data.confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  const email = data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  if (
    !user.passwordResetCode ||
    !user.passwordResetExpiry ||
    user.passwordResetExpiry < new Date() ||
    user.passwordResetCode !== data.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid or expired reset token");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(data.newPassword),
      passwordResetCode: null,
      passwordResetExpiry: null,
      isEmailVerified: true,
    },
  });

  return { message: "Password reset successfully" };
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export const authServices = {
  signUp,
  verifyEmail,
  login,
  socialLogin,
  setLocation,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
