import { Router } from "express";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  signUpSchema,
  verifyEmailSchema,
  loginSchema,
  setLocationSchema,
  socialLoginSchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", validateRequest(signUpSchema), authController.signUp);

router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  authController.verifyEmail
);

router.post("/login", validateRequest(loginSchema), authController.login);

router.post(
  "/set-location",
  auth,
  validateRequest(setLocationSchema),
  authController.setLocation
);

router.post(
  "/social-login",
  validateRequest(socialLoginSchema),
  authController.socialLogin
);

/* --------------------------- Password Reset Flow --------------------------- */

router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/verify-reset-otp",
  validateRequest(verifyResetOtpSchema),
  authController.verifyResetOtp
);

router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

export default router;
