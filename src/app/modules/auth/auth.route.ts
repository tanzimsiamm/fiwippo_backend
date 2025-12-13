import { Router } from "express";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  signUpSchema,
  verifyEmailSchema,
  loginSchema,
  setLocationSchema,
  socialLoginSchema,
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
  auth, // Protected Route
  validateRequest(setLocationSchema),
  authController.setLocation
);

router.post(
  "/social-login",
  validateRequest(socialLoginSchema),
  authController.socialLogin
);

export default router;
