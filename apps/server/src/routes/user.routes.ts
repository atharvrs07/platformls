import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  deleteAccountHandler,
  getMe,
  getProfile,
  getSessions,
  patchEmail,
  patchPassword,
  patchPreferences,
  patchProfile,
  revokeSession,
} from "../controllers/user.controller.js";
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  preferencesSchema,
  profileSchema,
} from "./schemas.js";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);
router.get("/profile", getProfile);
router.patch("/profile", validate(profileSchema), patchProfile);
router.patch("/preferences", validate(preferencesSchema), patchPreferences);
router.patch("/email", validate(changeEmailSchema), patchEmail);
router.patch("/password", validate(changePasswordSchema), patchPassword);

router.get("/sessions", getSessions);
router.delete("/sessions/:sessionId", revokeSession);

router.delete("/account", validate(deleteAccountSchema), deleteAccountHandler);

export default router;
