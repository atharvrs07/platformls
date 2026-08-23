import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { Prisma } from "@prisma/client";
import { isProduction } from "../config/env.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target) ? error.meta?.target[0] : undefined;
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: `A record with that ${target ?? "value"} already exists`,
        },
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Record not found" },
      });
    }
  }

  if (error instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: { code: "BAD_REQUEST", message: "Malformed request body" },
    });
  }

  console.error("[error]", error);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProduction ? "Something went wrong. Please try again." : String(error),
    },
  });
}
