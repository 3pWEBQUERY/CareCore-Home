import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    await pool().query("select 1");
    return Response.json(
      { status: "ok", database: { ok: true, ms: Date.now() - started } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "down", database: { ok: false } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
