import { Request, Response } from "express";
import {
  deleteAccount,
  getCurrentUserBundle,
  updateEmail,
  updatePreferences,
  updateProfile,
} from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success, message } from "../utils/apiResponse.js";
import {
  changePassword,
  listUserSessions,
  revokeSessionById,
} from "../services/auth.service.js";
import { REFRESH_COOKIE } from "../services/auth.service.js";
import { logout } from "./auth.controller.js";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const bundle = await getCurrentUserBundle(req.user!);
  success(res, bundle);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const bundle = await getCurrentUserBundle(req.user!);
  success(res, { user: bundle.user, profile: bundle.profile, preferences: bundle.preferences });
});

export const patchProfile = asyncHandler(async (req: Request, res: Response) => {
  const bundle = await updateProfile(req.user!, req.body);
  success(res, { user: bundle.user, profile: bundle.profile });
});

export const patchPreferences = asyncHandler(async (req: Request, res: Response) => {
  const preferences = await updatePreferences(req.user!, req.body);
  success(res, { preferences });
});

export const patchEmail = asyncHandler(async (req: Request, res: Response) => {
  await updateEmail(req.user!.id, req.body.email);
  message(res, "Email updated");
});

export const patchPassword = asyncHandler(async (req: Request, res: Response) => {
  await changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  await logout(req, res);
});

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await listUserSessions(req.user!.id, req.cookies?.[REFRESH_COOKIE]);
  success(res, { sessions });
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  await revokeSessionById(req.user!.id, req.params.sessionId);
  message(res, "Session revoked");
});

export const deleteAccountHandler = asyncHandler(async (req: Request, res: Response) => {
  await deleteAccount(req.user!, req.body.password);
  await logout(req, res);
});
