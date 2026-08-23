import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
  authRateLimiter,
  forgotPasswordRateLimiter,
  loginRateLimiter,
} from "../middleware/rateLimiter.js";
import {
  forgotPassword,
  login,
  logout,
  logoutAll,
  refresh,
  register,
  resendVerificationHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./schemas.js";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(register));
router.post("/login", loginRateLimiter, validate(loginSchema), asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.post("/logout-all", authenticate, asyncHandler(logoutAll));

router.post("/verify-email", validate(verifyEmailSchema), asyncHandler(verifyEmailHandler));
router.post("/resend-verification", authRateLimiter, validate(emailSchema), asyncHandler(resendVerificationHandler));
router.post("/forgot-password", forgotPasswordRateLimiter, validate(emailSchema), asyncHandler(forgotPassword));
router.post("/reset-password", forgotPasswordRateLimiter, validate(resetPasswordSchema), asyncHandler(resetPasswordHandler));

export default router;
