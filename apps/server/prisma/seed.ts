import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/security.js";
import { resolvePersistentDatabase } from "../src/prisma/storage.js";

resolvePersistentDatabase();

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = process.env.SEED_PASSWORD ?? "LiquiStudio123";

const accounts = [
  {
    email: "blacktechguy6@gmail.com",
    username: "blacktechguy",
    fullName: "LiquiStudio Admin",
    role: "ADMIN",
    title: "Founder",
    bio: "Founder & admin of the LiquiStudio workspace.",
  },
  {
    email: "atharvrs2010@gmail.com",
    username: "atharvrs",
    fullName: "Atharv Raj Sharma",
    role: "USER",
    title: "Beta Tester",
    bio: "Default beta test account for LiquiStudio.",
  },
];

async function createAccount(account: (typeof accounts)[number], password: string) {
  const existing = await prisma.user.findUnique({ where: { email: account.email } });
  if (existing) {
    console.log(`[seed] Account already exists (${account.email})`);
    return;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: account.email,
      emailVerified: true,
      username: account.username,
      fullName: account.fullName,
      role: account.role,
      timezone: "Asia/Kolkata",
      passwordHash,
      profile: { create: { bio: account.bio, title: account.title } },
      preferences: { create: { theme: "SYSTEM", language: "en" } },
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      credits: { create: { balance: 100, lifetime: 100 } },
      creditTxns: {
        create: { amount: 100, reason: "SIGNUP_BONUS", description: "Welcome credits" },
      },
    },
  });

  await prisma.workspace.create({
    data: {
      name: "Personal",
      slug: `me-${user.id.slice(0, 12).toLowerCase()}`,
      isPersonal: true,
      createdById: user.id,
      members: { create: { userId: user.id, role: "OWNER" } },
    },
  });

  console.log(`[seed] Created ${account.role.toLowerCase()} account: ${account.email}`);
}

async function main() {
  for (const account of accounts) {
    await createAccount(account, DEFAULT_PASSWORD);
  }

  console.log(`[seed] Password for both accounts: ${DEFAULT_PASSWORD}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
