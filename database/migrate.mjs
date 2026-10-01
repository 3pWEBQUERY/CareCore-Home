// Wendet ausstehende Migrationen aus database/migrations an (je Datei eine Transaktion, mit Prüfsumme)
// und legt beim ersten Lauf das Administrationskonto aus CARECORE_ADMIN_EMAIL / CARECORE_ADMIN_PASSWORD an.
import { createHash, randomBytes, scryptSync } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL fehlt.");
  process.exit(1);
}

const dir = join(import.meta.dirname, "migrations");
const client = new pg.Client({ connectionString: url, ssl: sslFor(url) });
await client.connect();

try {
  await client.query(`create table if not exists schema_migrations (
    name text primary key, checksum text not null, applied_at timestamptz not null default now())`);
  const applied = new Map(
    (await client.query("select name, checksum from schema_migrations")).rows.map((r) => [r.name, r.checksum]),
  );

  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    const sql = readFileSync(join(dir, file), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    if (applied.has(file)) {
      if (applied.get(file) !== checksum) throw new Error(`Migration ${file} wurde nach dem Anwenden verändert.`);
      continue;
    }
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into schema_migrations (name, checksum) values ($1, $2)", [file, checksum]);
      await client.query("commit");
      console.log(`Migration angewendet: ${file}`);
    } catch (error) {
      await client.query("rollback");
      throw error;
    }
  }

  const email = process.env.CARECORE_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.CARECORE_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("CARECORE_ADMIN_PASSWORD braucht mindestens 12 Zeichen.");
    const exists = await client.query("select 1 from app_users where lower(email) = $1", [email]);
    if (!exists.rowCount) {
      await client.query(
        "insert into app_users (email, password_hash, name, role) values ($1, $2, 'Administration', 'admin')",
        [email, hashPassword(password)],
      );
      console.log(`Administrationskonto angelegt: ${email}`);
    }
  }
  console.log("Datenbank ist aktuell.");
} finally {
  await client.end();
}

function sslFor(connection) {
  // Railway: privates Netz ohne TLS, öffentliche Proxy-Adresse mit TLS.
  return /sslmode=require|proxy\.rlwy\.net/.test(connection) ? { rejectUnauthorized: false } : undefined;
}

// Gleiches Format wie lib/password.ts
function hashPassword(value) {
  const salt = randomBytes(16);
  const hash = scryptSync(value, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${hash.toString("base64")}`;
}
