import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import { generateToken } from "../../utils/jwt.util";
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
} from "./auth.interface";

// --- Helpers ---
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email: string, code: string) => {
  // TODO: Integrate actual email service (AWS SES, SendGrid, etc.)
  console.log(`[DEV] Verification code for ${email}: ${code}`);
};

// --- Services ---

const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const email = data.email.toLowerCase().trim();

  // 1. Validate Organization (Critical for Multi-tenancy)
  const organization = await prisma.organization.findUnique({
    where: { slug: data.orgSlug },
  });

  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");
  }

  // 2. Check if user exists (globally or per-org depending on need, here we check global email)
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "Email already exists");
  }

  // 3. Prepare data
  const hashedPassword = await hashPassword(data.password);
  const verificationCode = generateVerificationCode();
  const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // 4. Create User
  const user = await prisma.user.create({
    data: {
      organizationId: organization.id, // Linked to found organization
      name: data.name || null,
      email,
      passwordHash: hashedPassword, // Matches schema
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpiry,
      role: "USER",
    },
  });

  await sendVerificationEmail(email, verificationCode);

  return {
    userId: user.id,
    email: user.email,
    message: "Verification code sent to your email",
  };
};

const verifyEmail = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
  const email = data.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (user.isEmailVerified) throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");

  // Check code validity
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

  // Update User
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    },
  });

  // Generate Tokens
  const payload = {
    userId: updatedUser.id,
    email: updatedUser.email,
    organizationId: updatedUser.organizationId,
    role: updatedUser.role
  };
  
  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  // Store Refresh Token Hash
  const hashedRefresh = await hashPassword(refreshToken);
  
  await prisma.user.update({
    where: { id: updatedUser.id },
    data: { refreshTokenHash: hashedRefresh }, // Matches schema
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

  const isPasswordValid = await comparePassword(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  // Generate Tokens
  const payload = {
    userId: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  };

  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await hashPassword(refreshToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: hashedRefresh }, // Matches schema
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

const setLocation = async (data: SetLocationRequest) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const updatedUser = await prisma.user.update({
    where: { id: data.userId },
    data: { location: data.location },
  });

  return updatedUser;
};

const socialLogin = async (data: SocialLoginRequest): Promise<AuthResponse> => {
  // 1. Validate Org
  const organization = await prisma.organization.findUnique({
    where: { slug: data.orgSlug },
  });
  if (!organization) throw new ApiError(httpStatus.NOT_FOUND, "Organization not found");

  // TODO: Validate real token with Google/Apple API
  // const verifiedPayload = await verifyGoogleToken(data.token);
  const userInfo = { email: "social-mock@example.com", name: "Social User" }; 

  const email = userInfo.email.toLowerCase().trim();

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Create new user via social
    user = await prisma.user.create({
      data: {
        organizationId: organization.id,
        email,
        name: userInfo.name,
        role: "USER",
        isEmailVerified: true, // Social accounts are usually trusted
        provider: data.provider,
        passwordHash: null,
      },
    });
  }

  // Generate Tokens
  const payload = {
    userId: user.id,
    email: user.email,
    organizationId: user.organizationId,
    role: user.role
  };

  const accessToken = generateToken(payload, "access");
  const refreshToken = generateToken(payload, "refresh");

  const hashedRefresh = await hashPassword(refreshToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: hashedRefresh },
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

export const authServices = {
  signUp,
  verifyEmail,
  login,
  setLocation,
  socialLogin,
};