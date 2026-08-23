import { Request, Response } from "express";
import {
  REFRESH_COOKIE,
  loginUser,
  registerUser,
  refreshSession,
  revokeSession,
  revokeAllSessions,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js";
import { success, message } from "../utils/apiResponse.js";
import { accessCookieOptions, refreshCookieOptions } from "../config/env.js";

export const ACCESS_COOKIE = "access_token";

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean
) {
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  res.cookie(ACCESS_COOKIE, accessToken, {
    ...accessCookieOptions,
    sameSite: "lax",
    secure: accessCookieOptions.secure,
  });

  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...refreshCookieOptions,
    maxAge: refreshMaxAge,
    sameSite: "lax",
    secure: refreshCookieOptions.secure,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, accessCookieOptions);
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
}

function sessionMeta(req: Request) {
  return {
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  };
}

export async function register(req: Request, res: Response) {
  const { email, username, fullName, password } = req.body;
  const result = await registerUser({ email, username, fullName, password }, sessionMeta(req));
  setAuthCookies(res, result.accessToken, result.refreshToken, false);
  success(res, { user: result.user, sessionId: result.sessionId }, 201);
}

export async function login(req: Request, res: Response) {
  const { identifier, password, rememberMe } = req.body;
  const result = await loginUser(identifier, password, Boolean(rememberMe), sessionMeta(req));
  setAuthCookies(res, result.accessToken, result.refreshToken, result.rememberMe);
  success(res, {
    user: result.user,
    sessionId: result.sessionId,
    pendingVerification: result.pendingVerification,
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await refreshSession(req.cookies?.[REFRESH_COOKIE]);
  setAuthCookies(res, result.accessToken, result.refreshToken, true);
  success(res, { user: result.user });
}

export async function logout(req: Request, res: Response) {
  await revokeSession(req.cookies?.[REFRESH_COOKIE]);
  clearAuthCookies(res);
  message(res, "Signed out successfully");
}

export async function logoutAll(req: Request, res: Response) {
  const userId = req.user!.id;
  const currentRefresh = req.cookies?.[REFRESH_COOKIE];
  await revokeAllSessions(userId, currentRefresh);
  clearAuthCookies(res);
  message(res, "Signed out of all sessions");
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const result = await verifyEmail(req.body.token);
  success(res, result);
}

export async function resendVerificationHandler(req: Request, res: Response) {
  await resendVerification(req.body.email);
  message(res, "Verification email sent");
}

export async function forgotPassword(req: Request, res: Response) {
  await requestPasswordReset(req.body.email);
  message(res, "If that account exists, a reset link has been sent");
}

export async function resetPasswordHandler(req: Request, res: Response) {
  await resetPassword(req.body.token, req.body.password);
  message(res, "Password reset successfully. You can now sign in.");
}
