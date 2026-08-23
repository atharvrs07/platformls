import { prisma } from "../prisma/client.js";

export async function platformOverview() {
  const [
    totalUsers,
    verifiedUsers,
    admins,
    totalWorkspaces,
    totalProjects,
    activeSessions,
    totalApiKeys,
    totalAuditLogs,
    creditsSum,
    lifetimeSum,
    txnCount,
    planGroups,
    recentUsers,
    recentTxns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.workspace.count(),
    prisma.project.count(),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.apiKey.count(),
    prisma.auditLog.count(),
    prisma.credits.aggregate({ _sum: { balance: true } }),
    prisma.credits.aggregate({ _sum: { lifetime: true } }),
    prisma.creditTransaction.count(),
    prisma.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    }),
    prisma.creditTransaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { fullName: true, email: true } } },
    }),
  ]);

  return {
    users: { total: totalUsers, verified: verifiedUsers, admins },
    workspaces: totalWorkspaces,
    projects: totalProjects,
    sessions: activeSessions,
    apiKeys: totalApiKeys,
    auditLogs: totalAuditLogs,
    credits: {
      balanceSum: creditsSum._sum.balance ?? 0,
      lifetimeSum: lifetimeSum._sum.lifetime ?? 0,
      transactions: txnCount,
    },
    plans: planGroups.map((p) => ({ plan: p.plan, count: p._count._all })),
    recentUsers,
    recentTxns,
  };
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      emailVerified: true,
      lastLoginAt: true,
      createdAt: true,
      subscription: { select: { plan: true, status: true } },
      credits: { select: { balance: true, lifetime: true } },
    },
  });
}

export async function setUserActive(userId: string, isActive: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, isActive: true },
  });
}
