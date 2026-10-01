import { getCurrentUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";

// Anhänge nur für die Kundschaft des Tickets (ohne interne Notizen) und die Administration.
export async function GET(_: Request, { params }: RouteContext<"/api/anhang/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return new Response("Nicht angemeldet", { status: 401 });
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Nicht gefunden", { status: 404 });
  const file = await queryOne<{
    file_name: string;
    content_type: string;
    data: Buffer;
    customer_id: string;
    internal: boolean;
  }>(
    `select a.file_name, a.content_type, a.data, t.customer_id, m.internal
     from ticket_attachments a join tickets t on t.id = a.ticket_id join ticket_messages m on m.id = a.message_id
     where a.id = $1`,
    [id],
  );
  const allowed = file && (user.role === "admin" || (file.customer_id === user.id && !file.internal));
  if (!allowed) return new Response("Nicht gefunden", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.content_type,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.file_name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
