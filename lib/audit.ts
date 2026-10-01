import "server-only";
import type { PoolClient } from "pg";
import { pool } from "./db";

export async function audit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId = "",
  detail = "",
  client?: PoolClient,
) {
  await (client ?? pool()).query(
    "insert into audit_log (actor_id, action, entity, entity_id, detail) values ($1, $2, $3, $4, $5)",
    [actorId, action, entity, entityId, detail.slice(0, 1000)],
  );
}
