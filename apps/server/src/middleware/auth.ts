import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../prisma/client.js";

const ACCESS_COOKIE = "access_token";

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      token = header.slice(7);
    } else if (req.cookies?.[ACCESS_COOKIE]) {
      token = req.cookies[ACCESS_COOKIE];
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication required");
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized("Session expired. Please sign in again.");
    }

    if (payload.type !== "access") {
      throw ApiError.unauthorized("Invalid token");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw ApiError.unauthorized("Account no longer exists");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("This account has been deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
