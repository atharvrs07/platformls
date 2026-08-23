import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  deleteProject,
  getProjects,
  getWorkspaceDetail,
  getWorkspaces,
  patchProject,
  postProject,
} from "../controllers/workspace.controller.js";
import { projectSchema, updateProjectSchema } from "./schemas.js";

const router = Router();

router.use(authenticate);

router.get("/", getWorkspaces);
router.get("/:workspaceId", getWorkspaceDetail);

router.get("/:workspaceId/projects", getProjects);
router.post("/:workspaceId/projects", validate(projectSchema), postProject);
router.patch("/:workspaceId/projects/:projectId", validate(updateProjectSchema), patchProject);
router.delete("/:workspaceId/projects/:projectId", deleteProject);

export default router;
