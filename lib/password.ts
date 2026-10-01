import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;

function derive(value: string, salt: Buffer, n: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(value, salt, 64, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key),
    ),
  );
}

// Format: scrypt$N$r$p$salt$hash (gleich wie database/migrate.mjs)
export async function hashPassword(value: string) {
  const salt = randomBytes(16);
  const hash = await derive(value, salt, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(value: string, stored: string) {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await derive(value, Buffer.from(salt, "base64"), Number(n), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function passwordProblem(value: string) {
  if (value.length < 10) return "Das Passwort braucht mindestens 10 Zeichen.";
  if (value.length > 200) return "Das Passwort ist zu lang.";
  if (!/[A-Za-zÄÖÜäöü]/.test(value) || !/[0-9]/.test(value)) return "Das Passwort braucht Buchstaben und Ziffern.";
  return null;
}

export function randomPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(16);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length])
    .join("")
    .replace(/(.{4})(?!$)/g, "$1-");
}
