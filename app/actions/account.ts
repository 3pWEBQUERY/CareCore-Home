"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { clientKey, currentSessionHash, isThrottled, recordAttempt, requireAdmin, requireUser } from "@/lib/auth";
import { query, queryOne, transaction } from "@/lib/db";
import { parseMoney } from "@/lib/format";
import { demoStatus, pick, units } from "@/lib/labels";
import { adminEmails, appUrl, sendMail } from "@/lib/mail";
import { hashPassword, passwordProblem, randomPassword, verifyPassword } from "@/lib/password";

const text = (data: FormData, key: string, max = 200) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);
const uuid = (value: FormDataEntryValue | null) => {
  const id = String(value ?? "");
  return /^[0-9a-f-]{36}$/.test(id) ? id : null;
};
const back = (data: FormData, fallback: string) => {
  const value = String(data.get("back") ?? "");
  return value === "/konto/profil" || value === "/admin/profil" ? value : fallback;
};

// ---------- Eigenes Profil ----------

export async function updateProfile(data: FormData) {
  const user = await requireUser();
  const path = back(data, "/konto/profil");
  const name = text(data, "name", 120);
  if (!name) redirect(`${path}?fehler=pflicht`);
  await query(
    `update app_users set name = $2, organisation = $3, role_title = $4, phone = $5, street = $6, zip_city = $7,
       country = $8, updated_at = now() where id = $1`,
    [
      user.id,
      name,
      text(data, "organisation", 160),
      text(data, "role_title", 120),
      text(data, "phone", 60),
      text(data, "street", 160),
      text(data, "zip_city", 120),
      text(data, "country", 80) || "Schweiz",
    ],
  );
  await audit(user.id, "profil_geaendert", "konto", user.id);
  redirect(`${path}?ok=gespeichert`);
}

export async function changePassword(data: FormData) {
  const user = await requireUser();
  const path = back(data, "/konto/profil");
  const row = await queryOne<{ password_hash: string }>("select password_hash from app_users where id = $1", [user.id]);
  const key = `pw:${user.id}`;
  if (await isThrottled(key, 5)) redirect(`${path}?fehler=passwort_falsch`);
  const valid = row ? await verifyPassword(String(data.get("current") ?? ""), row.password_hash) : false;
  await recordAttempt(key, valid);
  if (!valid) redirect(`${path}?fehler=passwort_falsch`);
  const next = String(data.get("password") ?? "");
  if (passwordProblem(next)) redirect(`${path}?fehler=passwort_schwach`);
  if (next !== String(data.get("password2") ?? "")) redirect(`${path}?fehler=passwort_gleich`);
  await query("update app_users set password_hash = $2, updated_at = now() where id = $1", [
    user.id,
    await hashPassword(next),
  ]);
  await query("delete from app_sessions where user_id = $1 and token_hash <> $2", [
    user.id,
    await currentSessionHash(),
  ]);
  await audit(user.id, "passwort_geaendert", "konto", user.id);
  redirect(`${path}?ok=passwort`);
}

export async function logoutOthers(data: FormData) {
  const user = await requireUser();
  await query("delete from app_sessions where user_id = $1 and token_hash <> $2", [
    user.id,
    await currentSessionHash(),
  ]);
  redirect(`${back(data, "/konto/profil")}?ok=abgemeldet_andere`);
}

// ---------- Demo-Anfrage (öffentlich) ----------

export type DemoState = { ok?: boolean; error?: string } | undefined;

export async function submitDemoRequest(_: DemoState, data: FormData): Promise<DemoState> {
  const name = text(data, "name", 120);
  const organisation = text(data, "organisation", 160);
  const email = text(data, "email").toLowerCase();
  if (text(data, "website")) return { ok: true }; // Honeypot für Bots
  if (!name || !organisation || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Bitte Name, Einrichtung und eine gültige E-Mail-Adresse angeben." };
  }
  if (!data.get("consent")) return { error: "Bitte bestätigen Sie die Einwilligung." };
  const key = `demo:${await clientKey()}`;
  if (await isThrottled(key, 5)) return { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  await recordAttempt(key, false);
  const row = await queryOne<{ id: string }>(
    `insert into demo_requests (name, organisation, role_title, email, phone, beds, message)
     values ($1, $2, $3, $4, $5, $6, $7) returning id`,
    [
      name,
      organisation,
      text(data, "role", 120),
      email,
      text(data, "phone", 60),
      text(data, "beds", 60),
      text(data, "message", 4000),
    ],
  );
  await sendMail(
    await adminEmails(),
    `Demo-Anfrage: ${organisation}`,
    `${name} (${text(data, "role")}) · ${email} · ${text(data, "phone")}\nPlätze: ${text(data, "beds")}\n\n${text(
      data,
      "message",
      4000,
    )}\n\n${appUrl(`/admin/anfragen#${row?.id}`)}`,
  );
  return { ok: true };
}

// ---------- Administration: Anfragen ----------

export async function adminDemoStatus(data: FormData) {
  const admin = await requireAdmin();
  const id = uuid(data.get("id"));
  if (data.get("action") === "delete") {
    await query("delete from demo_requests where id = $1", [id]);
    await audit(admin.id, "anfrage_geloescht", "anfrage", id ?? "");
    redirect("/admin/anfragen?ok=geloescht");
  }
  const status = pick(demoStatus, data.get("status"));
  if (status) await query("update demo_requests set status = $2 where id = $1", [id, status]);
  redirect("/admin/anfragen?ok=gespeichert");
}

// ---------- Administration: Kundschaft ----------

export async function adminUpdateCustomer(data: FormData) {
  const admin = await requireAdmin();
  const id = uuid(data.get("user_id"));
  const path = `/admin/kunden/${id}`;
  const email = text(data, "email").toLowerCase();
  const name = text(data, "name", 120);
  if (!id || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect(`${path}?fehler=pflicht`);
  const role = data.get("role") === "admin" ? "admin" : "customer";
  const active = data.get("active") === "on";
  if (id === admin.id && (role !== "admin" || !active)) redirect(`${path}?fehler=selbst`);
  const clash = await queryOne("select 1 from app_users where lower(email) = $1 and id <> $2", [email, id]);
  if (clash) redirect(`${path}?fehler=email`);
  await transaction(async (client) => {
    await client.query(
      `update app_users set name = $2, email = $3, organisation = $4, role_title = $5, phone = $6, street = $7,
         zip_city = $8, country = $9, role = $10, active = $11, updated_at = now() where id = $1`,
      [
        id,
        name,
        email,
        text(data, "organisation", 160),
        text(data, "role_title", 120),
        text(data, "phone", 60),
        text(data, "street", 160),
        text(data, "zip_city", 120),
        text(data, "country", 80) || "Schweiz",
        role,
        active,
      ],
    );
    if (!active) await client.query("delete from app_sessions where user_id = $1", [id]);
    await audit(admin.id, "konto_geaendert", "konto", id, `${email} · ${role}${active ? "" : " · gesperrt"}`, client);
  });
  redirect(`${path}?ok=gespeichert`);
}

export type ResetState = { password?: string; error?: string } | undefined;

export async function adminResetPassword(_: ResetState, data: FormData): Promise<ResetState> {
  const admin = await requireAdmin();
  const id = uuid(data.get("user_id"));
  if (!id || id === admin.id) return { error: "Das eigene Passwort ändern Sie unter Profil." };
  const password = randomPassword();
  await query("update app_users set password_hash = $2, updated_at = now() where id = $1", [
    id,
    await hashPassword(password),
  ]);
  await query("delete from app_sessions where user_id = $1", [id]);
  await audit(admin.id, "passwort_neu_gesetzt", "konto", id);
  return { password };
}

export async function adminCreateCustomer(_: ResetState, data: FormData): Promise<ResetState> {
  const admin = await requireAdmin();
  const email = text(data, "email").toLowerCase();
  const name = text(data, "name", 120);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Bitte Name und gültige E-Mail angeben." };
  const password = randomPassword();
  const row = await queryOne<{ id: string }>(
    `insert into app_users (email, password_hash, name, organisation) values ($1, $2, $3, $4)
     on conflict do nothing returning id`,
    [email, await hashPassword(password), name, text(data, "organisation", 160)],
  );
  if (!row) return { error: "Für diese E-Mail-Adresse besteht bereits ein Konto." };
  await audit(admin.id, "konto_angelegt", "konto", row.id, email);
  return { password };
}

// ---------- Administration: Produkte ----------

export async function adminSaveProduct(data: FormData) {
  const admin = await requireAdmin();
  const id = uuid(data.get("id"));
  const name = text(data, "name", 160);
  const price = parseMoney(data.get("price"));
  const vat = Number(text(data, "vat_rate").replace(",", ".") || "8.1");
  const unit = (units as readonly string[]).includes(text(data, "unit")) ? text(data, "unit") : "Monat";
  if (!name) redirect("/admin/produkte?fehler=pflicht");
  if (price === null || !Number.isFinite(vat) || vat < 0 || vat > 30) redirect("/admin/produkte?fehler=betrag");
  const values = [
    name,
    text(data, "description", 600),
    unit,
    price,
    vat,
    data.get("active") === "on",
    Number(text(data, "sort")) || 0,
  ];
  if (id) {
    await query(
      `update products set name = $2, description = $3, unit = $4, price_cents = $5, vat_rate = $6, active = $7, sort = $8
       where id = $1`,
      [id, ...values],
    );
  } else {
    await query(
      "insert into products (name, description, unit, price_cents, vat_rate, active, sort) values ($1, $2, $3, $4, $5, $6, $7)",
      values,
    );
  }
  await audit(admin.id, id ? "produkt_geaendert" : "produkt_angelegt", "produkt", id ?? "", name);
  redirect(`/admin/produkte?ok=${id ? "gespeichert" : "angelegt"}`);
}
