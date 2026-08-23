import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import {
  overview,
  users,
  toggleUserActive,
  waitlist,
  grantWaitlistEntry,
  revokeWaitlistEntry,
} from "../controllers/admin.controller.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { setUserActiveSchema } from "./schemas.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/overview", asyncHandler(overview));
router.get("/users", asyncHandler(users));
router.patch("/users/:userId/active", validate(setUserActiveSchema), asyncHandler(toggleUserActive));
router.get("/waitlist", asyncHandler(waitlist));
router.post("/waitlist/:entryId/grant", asyncHandler(grantWaitlistEntry));
router.post("/waitlist/:entryId/revoke", asyncHandler(revokeWaitlistEntry));

export default router;
