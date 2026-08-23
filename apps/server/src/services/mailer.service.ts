import nodemailer, { Transporter } from "nodemailer";
import { env, isProduction } from "../config/env.js";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.MAILER_HOST) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAILER_HOST,
      port: env.MAILER_PORT ?? 587,
      secure: env.MAILER_SECURE,
      auth:
        env.MAILER_USER && env.MAILER_PASS
          ? { user: env.MAILER_USER, pass: env.MAILER_PASS }
          : undefined,
    });
  }
  return transporter;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const t = getTransporter();

  if (!t) {
    if (isProduction) {
      throw new Error("MAILER_HOST is not configured but production email was attempted");
    }
    console.log(
      "\n==============================[ MAIL DEV LOG ]==============================\n" +
        `To:      ${payload.to}\n` +
        `Subject: ${payload.subject}\n` +
        `Body:\n${payload.html}\n` +
        "============================================================================\n"
    );
    return;
  }

  await t.sendMail({
    from: env.MAILER_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function buildHtmlFrame(title: string, body: string, ctaLabel: string, ctaUrl: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #ececf1;padding:40px;">
          <tr><td style="font-size:18px;font-weight:700;color:#0b0b0f;padding-bottom:8px;">${title}</td></tr>
          <tr><td style="color:#52525b;font-size:15px;line-height:1.6;padding-bottom:24px;">${body}</td></tr>
          <tr><td align="center" style="padding-bottom:24px;">
            <a href="${ctaUrl}" style="display:inline-block;background:#111113;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:10px;">${ctaLabel}</a>
          </td></tr>
          <tr><td style="color:#a1a1aa;font-size:12px;line-height:1.6;border-top:1px solid #f0f0f4;padding-top:16px;">
            If the button doesn't work, copy and paste this link into your browser:<br/><span style="color:#71717a;">${ctaUrl}</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
