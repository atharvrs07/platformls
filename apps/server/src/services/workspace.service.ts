import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "@prisma/client";

export async function listUserWorkspaces(user: User) {
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id, status: "ACTIVE" },
    include: { workspace: true },
    orderBy: [{ joinedAt: "asc" }],
  });

  return memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    slug: m.workspace.slug,
    logoUrl: m.workspace.logoUrl,
    isPersonal: m.workspace.isPersonal,
    role: m.role,
  }));
}

export async function getWorkspace(user: User, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
    include: { workspace: true },
  });

  if (!membership) {
    throw ApiError.notFound("Workspace not found");
  }

  const [projects, memberCount] = await Promise.all([
    prisma.project.findMany({
      where: { workspaceId, isArchived: false },
      orderBy: { updatedAt: "desc" },
      take: 50,
    }),
    prisma.workspaceMember.count({ where: { workspaceId } }),
  ]);

  return {
    workspace: {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      logoUrl: membership.workspace.logoUrl,
      isPersonal: membership.workspace.isPersonal,
      createdAt: membership.workspace.createdAt,
      role: membership.role,
    },
    projects,
    memberCount,
  };
}

export async function createProject(
  user: User,
  workspaceId: string,
  input: { name: string; description?: string; icon?: string; color?: string }
) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });

  if (!membership) {
    throw ApiError.notFound("Workspace not found");
  }

  const canCreate = membership.role === "OWNER" || membership.role === "ADMIN";
  if (!canCreate) {
    throw ApiError.forbidden("You do not have permission to create projects");
  }

  return prisma.project.create({
    data: {
      workspaceId,
      name: input.name,
      description: input.description,
      icon: input.icon,
      color: input.color,
      createdById: user.id,
    },
  });
}

export async function listProjects(user: User, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });
  if (!membership) throw ApiError.notFound("Workspace not found");

  return prisma.project.findMany({
    where: { workspaceId, isArchived: false },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });
}

export async function updateProject(
  user: User,
  workspaceId: string,
  projectId: string,
  input: { name?: string; description?: string; icon?: string; color?: string }
) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });
  if (!membership) throw ApiError.notFound("Workspace not found");

  const project = await prisma.project.findFirst({
    where: { id: projectId, workspaceId },
  });
  if (!project) throw ApiError.notFound("Project not found");

  return prisma.project.update({
    where: { id: projectId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
    },
  });
}

export async function archiveProject(user: User, workspaceId: string, projectId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });
  if (!membership) throw ApiError.notFound("Workspace not found");

  const project = await prisma.project.findFirst({ where: { id: projectId, workspaceId } });
  if (!project) throw ApiError.notFound("Project not found");

  return prisma.project.update({ where: { id: projectId }, data: { isArchived: true } });
}
