import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/apiError.js";

export async function joinWaitlist(email: string, name: string) {
  const normalized = email.toLowerCase();

  const entry = await prisma.waitlistEntry.findUnique({ where: { email: normalized } });

  if (entry) {
    if (entry.status === "GRANTED") {
      throw ApiError.conflict("You're already on the list — and you've been granted beta access! Check your inbox.");
    }
    throw ApiError.conflict("You're already on the waitlist. We'll be in touch soon!");
  }

  return prisma.waitlistEntry.create({
    data: { email: normalized, name: name.trim() },
  });
}

export async function listWaitlist() {
  return prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function setWaitlistStatus(id: string, status: "PENDING" | "GRANTED") {
  const entry = await prisma.waitlistEntry.findUnique({ where: { id } });
  if (!entry) throw ApiError.notFound("Waitlist entry not found");

  return prisma.waitlistEntry.update({
    where: { id },
    data: { status, grantedAt: status === "GRANTED" ? new Date() : null },
  });
}
