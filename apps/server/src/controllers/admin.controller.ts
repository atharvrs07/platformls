import { Request, Response } from "express";
import { platformOverview, listUsers, setUserActive } from "../services/admin.service.js";
import { listWaitlist, setWaitlistStatus } from "../services/waitlist.service.js";
import { success, message } from "../utils/apiResponse.js";

export async function overview(_req: Request, res: Response) {
  const data = await platformOverview();
  success(res, data);
}

export async function users(_req: Request, res: Response) {
  const users = await listUsers();
  success(res, { users });
}

export async function toggleUserActive(req: Request, res: Response) {
  const { isActive } = req.body;
  const user = await setUserActive(req.params.userId, Boolean(isActive));
  message(res, `Account ${user.isActive ? "activated" : "deactivated"}`);
}

export async function waitlist(_req: Request, res: Response) {
  const entries = await listWaitlist();
  success(res, { entries });
}

export async function grantWaitlistEntry(req: Request, res: Response) {
  await setWaitlistStatus(req.params.entryId, "GRANTED");
  message(res, "Beta access granted — this email can now register");
}

export async function revokeWaitlistEntry(req: Request, res: Response) {
  await setWaitlistStatus(req.params.entryId, "PENDING");
  message(res, "Beta access revoked");
}
