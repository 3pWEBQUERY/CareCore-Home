import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

const globalForPool = globalThis as unknown as { carecorePool?: Pool };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL fehlt.");
  return new Pool({
    connectionString,
    max: 10,
    // Railway: privates Netz ohne TLS, öffentliche Proxy-Adresse mit TLS.
    ssl: /sslmode=require|proxy\.rlwy\.net/.test(connectionString) ? { rejectUnauthorized: false } : undefined,
  });
}

export function pool() {
  globalForPool.carecorePool ??= createPool();
  return globalForPool.carecorePool;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return (await pool().query<T>(text, params)).rows;
}

export async function queryOne<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return (await query<T>(text, params))[0] ?? null;
}

export async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await pool().connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
