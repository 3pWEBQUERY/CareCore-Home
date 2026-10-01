import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { query } from "./db";

// Optional: Mit SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD und MAIL_FROM gehen Benachrichtigungen per E-Mail hinaus.
// Ohne diese Angaben läuft alles weiter, nur ohne E-Mails.
export const mailEnabled = () => Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);

let transport: Transporter | null = null;

export async function sendMail(to: string | string[], subject: string, text: string) {
  if (!mailEnabled()) return;
  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (!recipients.length) return;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
  try {
    await transport.sendMail({ from: process.env.MAIL_FROM, to: recipients, subject, text });
  } catch (error) {
    console.error("E-Mail konnte nicht gesendet werden:", (error as Error).message);
  }
}

export async function adminEmails() {
  const extra = (process.env.NOTIFY_EMAIL ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const rows = await query<{ email: string }>("select email from app_users where role = 'admin' and active");
  return [...new Set([...extra, ...rows.map((r) => r.email)])];
}

export const appUrl = (path: string) =>
  new URL(path, process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").toString();
