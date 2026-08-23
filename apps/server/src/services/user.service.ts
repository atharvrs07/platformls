import { User } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/apiError.js";

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  title?: string;
  avatarUrl?: string;
  timezone?: string;
}

export interface UpdatePreferencesInput {
  theme?: "LIGHT" | "DARK" | "SYSTEM";
  language?: string;
  emailNotifications?: boolean;
  productUpdates?: boolean;
  weeklyDigest?: boolean;
  marketingEmails?: boolean;
  reducedMotion?: boolean;
}

export async function getCurrentUserBundle(user: User) {
  const [profile, preferences, subscription, credits, personalWorkspace] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.userPreferences.findUnique({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.credits.findUnique({ where: { userId: user.id } }),
    prisma.workspace.findFirst({ where: { createdById: user.id, isPersonal: true } }),
  ]);

  return {
    user: {
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
    },
    profile,
    preferences,
    subscription: subscription
      ? {
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }
      : null,
    credits,
    workspace: personalWorkspace
      ? { id: personalWorkspace.id, name: personalWorkspace.name, slug: personalWorkspace.slug, isPersonal: true }
      : null,
  };
}

export async function updateProfile(user: User, input: UpdateProfileInput) {
  const updateUser: Record<string, unknown> = {};
  if (input.fullName !== undefined) updateUser.fullName = input.fullName.trim();
  if (input.avatarUrl !== undefined) updateUser.avatarUrl = input.avatarUrl;
  if (input.timezone !== undefined) updateUser.timezone = input.timezone;

  const [updatedUser] = await Promise.all([
    Object.keys(updateUser).length > 0
      ? prisma.user.update({ where: { id: user.id }, data: updateUser })
      : Promise.resolve(user),
    prisma.profile.update({
      where: { userId: user.id },
      data: {
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.website !== undefined ? { website: input.website } : {}),
        ...(input.company !== undefined ? { company: input.company } : {}),
        ...(input.title !== undefined ? { title: input.title } : {}),
      },
    }),
  ]);

  return getCurrentUserBundle(updatedUser);
}

export async function updatePreferences(user: User, input: UpdatePreferencesInput) {
  const data: Record<string, unknown> = {};
  if (input.theme !== undefined) data.theme = input.theme;
  if (input.language !== undefined) data.language = input.language;
  if (input.emailNotifications !== undefined) data.emailNotifications = input.emailNotifications;
  if (input.productUpdates !== undefined) data.productUpdates = input.productUpdates;
  if (input.weeklyDigest !== undefined) data.weeklyDigest = input.weeklyDigest;
  if (input.marketingEmails !== undefined) data.marketingEmails = input.marketingEmails;
  if (input.reducedMotion !== undefined) data.reducedMotion = input.reducedMotion;

  await prisma.userPreferences.update({ where: { userId: user.id }, data });

  return prisma.userPreferences.findUnique({ where: { userId: user.id } });
}

export async function deleteAccount(user: User, password?: string) {
  if (password) {
    const { comparePassword } = await import("../utils/security.js");
    const match = await comparePassword(password, user.passwordHash);
    if (!match) throw ApiError.badRequest("Password is incorrect");
  }

  await prisma.user.delete({ where: { id: user.id } });
  return { deleted: true };
}

export async function updateEmail(userId: string, email: string) {
  const normalized = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing && existing.id !== userId) {
    throw ApiError.conflict("An account with this email already exists");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { email: normalized, emailVerified: false },
  });

  return { changed: true };
}
