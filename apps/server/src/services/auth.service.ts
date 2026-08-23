import { User } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { comparePassword, generateRandomToken, hashPassword, hashToken } from "../utils/security.js";
import { signAccessToken } from "../utils/jwt.js";
import { sendEmail, buildHtmlFrame } from "./mailer.service.js";

export const REFRESH_COOKIE = "refresh_token";
const EMAIL_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export interface RegisterInput {
  email: string;
  username: string;
  fullName: string;
  password: string;
}

function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    timezone: user.timezone,
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export function buildAuthBundle(user: User) {
  return {
    user: publicUser(user),
    accessToken: signAccessToken({ sub: user.id, email: user.email }),
    refreshToken: generateRandomToken(48),
  };
}

async function createSession(userId: string, token: string, meta: { userAgent?: string; ip?: string }) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.updateMany({
    where: { userId },
    data: { isCurrent: false },
  });

  return prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: meta.userAgent?.slice(0, 255),
      ipAddress: meta.ip,
      isCurrent: true,
    },
  });
}

async function ensurePersonalWorkspace(userId: string) {
  const existing = await prisma.workspace.findFirst({
    where: { createdById: userId, isPersonal: true },
  });

  if (existing) return existing;

  return prisma.workspace.create({
    data: {
      name: "Personal",
      slug: `me-${userId.slice(0, 12).toLowerCase()}`,
      isPersonal: true,
      createdById: userId,
      members: {
        create: { userId, role: "OWNER" },
      },
    },
  });
}

async function issueEmailToken(userId: string, kind: "VERIFY_EMAIL" | "RESET_PASSWORD") {
  const token = generateRandomToken(32);
  const ttl = kind === "VERIFY_EMAIL" ? EMAIL_TOKEN_TTL_MS : RESET_TOKEN_TTL_MS;

  await prisma.emailToken.create({
    data: {
      userId,
      kind,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + ttl),
    },
  });

  return token;
}

export async function registerUser(input: RegisterInput, meta: { userAgent?: string; ip?: string }) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email.toLowerCase() }, { username: input.username.toLowerCase() }] },
  });

  if (existing) {
    if (existing.email === input.email.toLowerCase()) {
      throw ApiError.conflict("An account with this email already exists");
    }
    throw ApiError.conflict("This username is already taken");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      username: input.username.toLowerCase(),
      fullName: input.fullName.trim(),
      passwordHash,
      profile: { create: {} },
      preferences: { create: { theme: "SYSTEM" } },
      subscription: { create: { plan: "FREE" } },
      credits: { create: { balance: 100, lifetime: 100 } },
      creditTxns: {
        create: { amount: 100, reason: "SIGNUP_BONUS", description: "Welcome credits" },
      },
    },
  });

  await ensurePersonalWorkspace(user.id);

  const verificationToken = await issueEmailToken(user.id, "VERIFY_EMAIL");
  const verifyUrl = `${env.APP_URL}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: buildHtmlFrame(
      "Verify your email",
      `Welcome to ${env.BRAND_NAME}, ${user.fullName.split(" ")[0]}! Confirm your email address to activate your account.`,
      "Verify Email",
      verifyUrl
    ),
  });

  const session = await createSession(user.id, generateRandomToken(48), meta);

  return { ...buildAuthBundle(user), sessionId: session.id };
}

export async function loginUser(
  identifier: string,
  password: string,
  rememberMe: boolean,
  meta: { userAgent?: string; ip?: string }
) {
  const identifierLower = identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifierLower }, { username: identifierLower }],
    },
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw ApiError.unauthorized("Invalid credentials. Please check your email and password.");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated");
  }

  const session = await createSession(user.id, generateRandomToken(48), meta);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const bundle = buildAuthBundle(user);
  return {
    ...bundle,
    sessionId: session.id,
    rememberMe,
    pendingVerification: !user.emailVerified,
  };
}

export async function refreshSession(refreshToken: string | undefined) {
  if (!refreshToken) {
    throw ApiError.unauthorized("Missing refresh token");
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    throw ApiError.unauthorized("Session has expired. Please sign in again.");
  }

  const user = session.user;
  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated");
  }

  const nextToken = generateRandomToken(48);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      tokenHash: hashToken(nextToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      lastActiveAt: new Date(),
    },
  });

  return buildAuthBundle(user);
}

export async function revokeSession(refreshToken: string | undefined) {
  if (!refreshToken) return;
  await prisma.session.deleteMany({ where: { tokenHash: hashToken(refreshToken) } });
}

export async function revokeAllSessions(userId: string, exceptRefreshToken?: string) {
  if (exceptRefreshToken) {
    await prisma.session.deleteMany({ where: { userId, NOT: { tokenHash: hashToken(exceptRefreshToken) } } });
    return;
  }
  await prisma.session.deleteMany({ where: { userId } });
}

export async function verifyEmail(token: string) {
  const record = await prisma.emailToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.kind !== "VERIFY_EMAIL" || record.expiresAt < new Date()) {
    throw ApiError.badRequest("This verification link is invalid or has expired");
  }

  if (!record.usedAt) {
    await prisma.emailToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });

  return { verified: true };
}

export async function resendVerification(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user && !user.emailVerified) {
    const token = await issueEmailToken(user.id, "VERIFY_EMAIL");
    const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: buildHtmlFrame(
        "Verify your email",
        "Confirm your email address to activate your account.",
        "Verify Email",
        verifyUrl
      ),
    });
  }

  return { sent: true };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (user) {
    const token = await issueEmailToken(user.id, "RESET_PASSWORD");
    const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: buildHtmlFrame(
        "Reset your password",
        "We received a request to reset your password. This link expires in 1 hour.",
        "Reset Password",
        resetUrl
      ),
    });
  }

  return { sent: true };
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.emailToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.kind !== "RESET_PASSWORD" || record.expiresAt < new Date()) {
    throw ApiError.badRequest("This reset link is invalid or has expired");
  }

  if (!record.usedAt) {
    await prisma.emailToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.session.deleteMany({ where: { userId: record.userId } });

  return { reset: true };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.unauthorized();

  if (!(await comparePassword(currentPassword, user.passwordHash))) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { changed: true };
}

export async function listUserSessions(userId: string, currentRefreshToken?: string) {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { lastActiveAt: "desc" },
    take: 20,
  });

  const currentHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

  return sessions.map((s) => ({
    id: s.id,
    isCurrent: s.tokenHash === currentHash || s.isCurrent,
    userAgent: s.userAgent,
    ipAddress: s.ipAddress,
    lastActiveAt: s.lastActiveAt,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
  }));
}

export async function revokeSessionById(userId: string, sessionId: string) {
  await prisma.session.deleteMany({ where: { id: sessionId, userId } });
  return { revoked: true };
}

export function getUserBundle(user: User) {
  return publicUser(user);
}
