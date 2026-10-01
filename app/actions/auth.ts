"use server";

import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { clientKey, createSession, destroySession, hashToken, isThrottled, recordAttempt, safeNext } from "@/lib/auth";
import { query, queryOne, transaction } from "@/lib/db";
import { appUrl, mailEnabled, sendMail } from "@/lib/mail";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/password";

export type FormState = { error?: string; ok?: string; values?: Record<string, string> } | undefined;

const text = (data: FormData, key: string, max = 200) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function login(_: FormState, data: FormData): Promise<FormState> {
  const email = text(data, "email").toLowerCase();
  const password = String(data.get("password") ?? "");
  const values = { email };
  const ip = await clientKey();
  if ((await isThrottled(`ip:${ip}`, 30)) || (await isThrottled(`email:${email}`))) {
    return { error: "Zu viele Fehlversuche. Bitte warten Sie 15 Minuten.", values };
  }
  const user = await queryOne<{ id: string; password_hash: string; role: string; active: boolean }>(
    "select id, password_hash, role, active from app_users where lower(email) = $1",
    [email],
  );
  const valid = user ? await verifyPassword(password, user.password_hash) : false;
  await recordAttempt(`email:${email}`, valid);
  await recordAttempt(`ip:${ip}`, valid);
  if (!user || !valid) return { error: "E-Mail-Adresse oder Passwort stimmen nicht.", values };
  if (!user.active) return { error: "Dieses Konto ist gesperrt. Bitte kontaktieren Sie uns.", values };
  await createSession(user.id);
  redirect(safeNext(data.get("weiter"), user.role === "admin" ? "/admin" : "/konto"));
}

export async function register(_: FormState, data: FormData): Promise<FormState> {
  const values = {
    name: text(data, "name", 120),
    organisation: text(data, "organisation", 160),
    role_title: text(data, "role_title", 120),
    email: text(data, "email").toLowerCase(),
  };
  const password = String(data.get("password") ?? "");
  if (!values.name || !values.organisation) return { error: "Bitte Name und Einrichtung angeben.", values };
  if (!emailOk(values.email)) return { error: "Bitte eine gültige E-Mail-Adresse angeben.", values };
  const problem = passwordProblem(password);
  if (problem) return { error: problem, values };
  if (password !== String(data.get("password2") ?? ""))
    return { error: "Die Passwörter stimmen nicht überein.", values };
  if (!data.get("terms")) return { error: "Bitte bestätigen Sie die Datenschutzerklärung.", values };
  if (await isThrottled(`register:${await clientKey()}`, 10)) {
    return { error: "Zu viele Registrierungen von dieser Verbindung. Bitte später erneut versuchen.", values };
  }

  const hash = await hashPassword(password);
  const created = await queryOne<{ id: string }>(
    `insert into app_users (email, password_hash, name, organisation, role_title)
     values ($1, $2, $3, $4, $5) on conflict do nothing returning id`,
    [values.email, hash, values.name, values.organisation, values.role_title],
  );
  await recordAttempt(`register:${await clientKey()}`, false);
  if (!created)
    return { error: "Für diese E-Mail-Adresse besteht bereits ein Konto. Bitte melden Sie sich an.", values };
  await audit(created.id, "registriert", "konto", created.id);
  await createSession(created.id);
  redirect("/konto?willkommen=1");
}

export async function logout() {
  await destroySession();
  redirect("/anmelden?abgemeldet=1");
}

export async function requestReset(_: FormState, data: FormData): Promise<FormState> {
  const email = text(data, "email").toLowerCase();
  const done = { ok: "Falls ein Konto mit dieser Adresse besteht, haben wir einen Link zum Zurücksetzen gesendet." };
  if (!emailOk(email)) return { error: "Bitte eine gültige E-Mail-Adresse angeben.", values: { email } };
  if (await isThrottled(`reset:${await clientKey()}`, 5)) return done;
  await recordAttempt(`reset:${await clientKey()}`, false);
  const user = await queryOne<{ id: string }>("select id from app_users where lower(email) = $1 and active", [email]);
  if (user && mailEnabled()) {
    const token = randomBytes(32).toString("base64url");
    await query(
      "insert into app_password_resets (token_hash, user_id, expires_at) values ($1, $2, now() + interval '1 hour')",
      [hashToken(token), user.id],
    );
    await sendMail(
      email,
      "CareCore: Passwort zurücksetzen",
      `Guten Tag\n\nÜber diesen Link setzen Sie ein neues Passwort (gültig 1 Stunde, einmal verwendbar):\n${appUrl(
        `/passwort-zuruecksetzen?token=${token}`,
      )}\n\nHaben Sie das nicht angefordert, ignorieren Sie diese Nachricht.\n\nFreundliche Grüsse\nCareCore`,
    );
  }
  return done;
}

export async function resetPassword(_: FormState, data: FormData): Promise<FormState> {
  const token = String(data.get("token") ?? "");
  const password = String(data.get("password") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== String(data.get("password2") ?? "")) return { error: "Die Passwörter stimmen nicht überein." };
  const hash = await hashPassword(password);
  const userId = await transaction(async (client) => {
    const row = (
      await client.query<{ user_id: string }>(
        `update app_password_resets set used_at = now()
         where token_hash = $1 and used_at is null and expires_at > now() returning user_id`,
        [createHash("sha256").update(token).digest("hex")],
      )
    ).rows[0];
    if (!row) return null;
    await client.query("update app_users set password_hash = $1, updated_at = now() where id = $2", [
      hash,
      row.user_id,
    ]);
    await client.query("delete from app_sessions where user_id = $1", [row.user_id]);
    await audit(row.user_id, "passwort_zurueckgesetzt", "konto", row.user_id, "", client);
    return row.user_id;
  });
  if (!userId) return { error: "Der Link ist abgelaufen oder wurde bereits verwendet." };
  redirect("/anmelden?passwort=1");
}
