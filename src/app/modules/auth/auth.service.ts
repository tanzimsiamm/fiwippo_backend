import bcrypt from "bcryptjs";
import {
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  SetLocationRequest,
  SetLocationResponse,
  LoginRequest,
  AuthResponse,
  SocialLoginRequest,
} from "./auth.interface";
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import { generateToken } from "../../utils/jwt.util";

// Helper to generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper to send verification email (implement with your email service)
const sendVerificationEmail = async (email: string, code: string) => {
  // TODO: Implement email sending logic
  console.log(`Verification code for ${email}: ${code}`);
};

const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const email = data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, "Email already exists");

  const hashedPassword = await hashPassword(data.password);
  const verificationCode = generateVerificationCode();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpiry,
    },
  });

  // Send verification email
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

  if (!user) throw new ApiError(404, "User not found");
  if (user.isEmailVerified) throw new ApiError(400, "Email already verified");

  if (
    !user.verificationCode ||
    !user.verificationCodeExpiry ||
    user.verificationCodeExpiry < new Date()
  ) {
    throw new ApiError(400, "Verification code expired");
  }

  if (user.verificationCode !== data.code) {
    throw new ApiError(400, "Invalid verification code");
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    },
  });

  const payload = {
    userId: updatedUser.id,
    email: updatedUser.email,
  };

  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: updatedUser.id },
    data: { refreshToken: hashedRefresh },
  });

  return {
    success: true,
    message: "Email verified successfully",
    token: accessToken,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location || undefined,
      isEmailVerified: updatedUser.isEmailVerified,
    },
  };
};

const setLocation = async (
  data: SetLocationRequest
): Promise<SetLocationResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) throw new ApiError(404, "User not found");

  const updatedUser = await prisma.user.update({
    where: { id: data.userId },
    data: { location: data.location },
  });

  return {
    success: true,
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location || undefined,
      isEmailVerified: updatedUser.isEmailVerified,
    },
  };
};

const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password)
    throw new ApiError(401, "Invalid email or password");

  if (!user.isEmailVerified)
    throw new ApiError(403, "Please verify your email first");

  const match = await comparePassword(data.password, user.password);
  if (!match) throw new ApiError(401, "Invalid email or password");

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefresh },
  });

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location || undefined,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

const socialLogin = async (data: SocialLoginRequest): Promise<AuthResponse> => {
  // TODO: Verify the token with Google/Apple APIs
  // For now, this is a placeholder implementation

  let userInfo: { email: string; name: string };

  // Verify token with provider (implement actual verification)
  if (data.provider === "google") {
    // Verify Google token and extract user info
    userInfo = { email: "user@example.com", name: "User Name" };
  } else {
    // Verify Apple token and extract user info
    userInfo = { email: "user@example.com", name: "User Name" };
  }

  const email = userInfo.email.toLowerCase().trim();

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: userInfo.name,
        email,
        isEmailVerified: true,
        provider: data.provider,
      },
    });
  }

  const payload = {
    userId: user.id,
    email: user.email,
  };

  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefresh },
  });

  return {
    token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location || undefined,
      isEmailVerified: user.isEmailVerified,
    },
  };
};

export const authServices = {
  signUp,
  verifyEmail,
  setLocation,
  login,
  socialLogin,
};
