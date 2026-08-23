import { Request, Response } from "express";
import {
  archiveProject,
  createProject,
  getWorkspace,
  listProjects,
  listUserWorkspaces,
  updateProject,
} from "../services/workspace.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";

export const getWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  const workspaces = await listUserWorkspaces(req.user!);
  success(res, { workspaces });
});

export const getWorkspaceDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await getWorkspace(req.user!, req.params.workspaceId);
  success(res, data);
});

export const postProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await createProject(req.user!, req.params.workspaceId, req.body);
  success(res, { project }, 201);
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await listProjects(req.user!, req.params.workspaceId);
  success(res, { projects });
});

export const patchProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await updateProject(req.user!, req.params.workspaceId, req.params.projectId, req.body);
  success(res, { project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await archiveProject(req.user!, req.params.workspaceId, req.params.projectId);
  success(res, { archived: true });
});
