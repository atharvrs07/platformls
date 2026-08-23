import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { getProfile, patchPreferences } from "../controllers/user.controller.js";
import { preferencesSchema } from "./schemas.js";

const router = Router();

router.use(authenticate);

router.get("/", getProfile);
router.patch("/preferences", validate(preferencesSchema), patchPreferences);

export default router;
