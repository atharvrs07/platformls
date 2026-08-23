import dotenv from "dotenv";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: join(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("30d"),

  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),

  WEB_ORIGIN: z.string().default("http://localhost:3000"),

  MAILER_HOST: z.string().optional(),
  MAILER_PORT: z.coerce.number().optional(),
  MAILER_USER: z.string().optional(),
  MAILER_PASS: z.string().optional(),
  MAILER_FROM: z.string().default("LiquiStudio <noreply@liquistudio.com>"),
  MAILER_SECURE: z.string().optional().transform((v) => v === "true"),

  APP_URL: z.string().default("http://localhost:3000"),

  BRAND_NAME: z.string().default("LiquiStudio"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("[env] Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration. See logs above.");
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: "lax" as const,
  path: "/",
};

export const accessCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
