import { z } from "zod";
import { passwordSchema, usernameSchema } from "../utils/validation.js";

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  username: usernameSchema,
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional(),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  website: z.string().max(200).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  title: z.string().max(120).optional().nullable(),
  avatarUrl: z.string().max(500).optional().nullable(),
  timezone: z.string().max(64).optional(),
});

export const preferencesSchema = z.object({
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
  language: z.string().max(10).optional(),
  emailNotifications: z.boolean().optional(),
  productUpdates: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: passwordSchema,
});

export const changeEmailSchema = emailSchema;

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Enter your password to confirm"),
});

export const waitlistSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().trim().min(2, "Enter your name").max(80),
});

export const setUserActiveSchema = z.object({
  isActive: z.boolean(),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(20).optional().nullable(),
  color: z.string().max(24).optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(20).optional().nullable(),
  color: z.string().max(24).optional().nullable(),
});
