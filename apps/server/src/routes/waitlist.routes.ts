import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { joinWaitlistHandler } from "../controllers/waitlist.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { waitlistSchema } from "./schemas.js";

const router = Router();

router.post("/join", authRateLimiter, validate(waitlistSchema), asyncHandler(joinWaitlistHandler));

export default router;
