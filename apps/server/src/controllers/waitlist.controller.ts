import { Request, Response } from "express";
import { joinWaitlist } from "../services/waitlist.service.js";
import { message } from "../utils/apiResponse.js";

export async function joinWaitlistHandler(req: Request, res: Response) {
  const { email, name } = req.body;
  await joinWaitlist(email, name);
  message(res, "You're on the list! We'll let you know once beta testing starts.");
}
