import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/security.js";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL ?? "demo@liquistudio.com";
  const password = process.env.SEED_PASSWORD ?? "LiquiStudio123";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] Demo user already exists (${email})`);
    return;
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      emailVerified: true,
      username: "demo",
      fullName: "Demo User",
      timezone: "Asia/Kolkata",
      passwordHash,
      profile: {
        create: { bio: "Founding member of the LiquiStudio workspace.", title: "Founder" },
      },
      preferences: {
        create: { theme: "SYSTEM", language: "en" },
      },
      subscription: {
        create: { plan: "FREE", status: "ACTIVE" },
      },
      credits: {
        create: { balance: 100, lifetime: 100 },
      },
      creditTxns: {
        create: { amount: 100, reason: "SIGNUP_BONUS", description: "Welcome credits" },
      },
    },
  });

  await prisma.workspace.create({
    data: {
      name: "Personal",
      slug: `me-${user.id.slice(0, 12)}`,
      isPersonal: true,
      createdById: user.id,
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
    },
  });

  console.log(`[seed] Created demo user: ${email}`);
  console.log(`[seed]   password: ${password}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
