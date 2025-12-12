import { Router } from "express";
import {
  signUpSchema,
  verifyEmailSchema,
  setLocationSchema,
  loginSchema,
  socialLoginSchema,
} from "./auth.validation";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/signup", validateRequest(signUpSchema), authController.signUp);

router.post(
  "/verify-email",
  validateRequest(verifyEmailSchema),
  authController.verifyEmail
);

router.post(
  "/set-location",
  auth, // User must be logged in
  validateRequest(setLocationSchema),
  authController.setLocation
);

router.post("/login", validateRequest(loginSchema), authController.login);

router.post(
  "/social-login",
  validateRequest(socialLoginSchema),
  authController.socialLogin
);

export default router;
