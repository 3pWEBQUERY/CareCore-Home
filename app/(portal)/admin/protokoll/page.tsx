import type { Metadata } from "next";
import { Card, Empty, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Protokoll" };

export default async function LogPage() {
  await requireAdmin();
  const rows = await query<{
    id: number;
    action: string;
    entity: string;
    detail: string;
    created_at: Date;
    actor: string | null;
  }>(
    `select l.id, l.action, l.entity, l.detail, l.created_at, u.name as actor
     from audit_log l left join app_users u on u.id = l.actor_id order by l.created_at desc limit 300`,
  );
  return (
    <>
      <PageHeader
        eyebrow="Nachvollziehbarkeit"
        title="Protokoll"
        lead="Die letzten 300 Änderungen an Konten, Bestellungen, Rechnungen und Produkten."
      />
      <Card flush>
        {rows.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Zeitpunkt</th>
                <th>Person</th>
                <th>Bereich</th>
                <th>Aktion</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="nowrap">{dateTime(r.created_at)}</td>
                  <td>{r.actor ?? "–"}</td>
                  <td>{r.entity}</td>
                  <td>{r.action.replaceAll("_", " ")}</td>
                  <td className="muted-text">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Noch keine Einträge" />
        )}
      </Card>
    </>
  );
}
