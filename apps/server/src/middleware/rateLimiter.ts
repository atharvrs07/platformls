import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/apiError.js";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",
  handler: (_req, _res, next) => {
    next(ApiError.badRequest("Too many requests. Please try again in a few minutes."));
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many login attempts. Please try again later.",
  handler: (_req, _res, next) => {
    next(ApiError.badRequest("Too many login attempts. Please try again in a few minutes."));
  },
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many reset requests. Please try again later.",
  handler: (_req, _res, next) => {
    next(ApiError.badRequest("Too many reset requests. Please try again in an hour."));
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests.",
  handler: (_req, _res, next) => {
    next(ApiError.badRequest("Too many requests. Please slow down."));
  },
});
