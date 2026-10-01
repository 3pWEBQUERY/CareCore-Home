import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { query, queryOne } from "./db";

export const SESSION_COOKIE = "cch_session";
const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  organisation: string;
  role: "customer" | "admin";
};

export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const userAgent = ((await headers()).get("user-agent") ?? "").slice(0, 300);
  await query(
    `insert into app_sessions (token_hash, user_id, user_agent, expires_at)
     values ($1, $2, $3, now() + interval '${SESSION_DAYS} days')`,
    [hashToken(token), userId, userAgent],
  );
  await query("update app_users set last_login_at = now() where id = $1", [userId]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await query("delete from app_sessions where token_hash = $1", [hashToken(token)]);
  store.delete(SESSION_COOKIE);
}

export const currentSessionHash = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? hashToken(token) : null;
});

// Einmal pro Anfrage: Sitzung prüfen und gleitend verlängern.
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const tokenHash = await currentSessionHash();
  if (!tokenHash || !process.env.DATABASE_URL) return null;
  return queryOne<SessionUser>(
    `with s as (
       update app_sessions set last_seen_at = now(), expires_at = greatest(expires_at, now() + interval '${SESSION_DAYS} days')
       where token_hash = $1 and expires_at > now() returning user_id)
     select u.id, u.email, u.name, u.organisation, u.role
     from s join app_users u on u.id = s.user_id where u.active`,
    [tokenHash],
  );
});

export async function requireUser(next = "/konto") {
  const user = await getCurrentUser();
  if (!user) redirect(`/anmelden?weiter=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/konto");
  return user;
}

export async function clientKey() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "unbekannt").trim();
}

// Drossel: höchstens `limit` Fehlversuche je Schlüssel in 15 Minuten.
export async function isThrottled(key: string, limit = 8) {
  const row = await queryOne<{ count: string }>(
    `select count(*) from app_login_attempts where key = $1 and not success and created_at > now() - interval '15 minutes'`,
    [key],
  );
  return Number(row?.count ?? 0) >= limit;
}

export async function recordAttempt(key: string, success: boolean) {
  await query("insert into app_login_attempts (key, success) values ($1, $2)", [key, success]);
  if (Math.random() < 0.02) await query("delete from app_login_attempts where created_at < now() - interval '1 day'");
}

export function safeNext(value: FormDataEntryValue | string | null | undefined, fallback: string) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
