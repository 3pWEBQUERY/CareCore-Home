import Select from "@/app/components/select";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateTime, ticketNo } from "@/lib/format";
import { priorityTone, ticketCategory, ticketPriority, ticketStatusAdmin, ticketTone } from "@/lib/labels";
import { listTickets } from "@/lib/tickets";

export const metadata: Metadata = { title: "Tickets" };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function AdminTicketsPage({ searchParams }: PageProps<"/admin/tickets">) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const status = one(params.status);
  const view = status ? "status" : one(params.ansicht) || "offen";
  const priority = one(params.prioritaet);
  const assignee = one(params.zustaendig);
  const q = one(params.q).slice(0, 80);
  const [tickets, admins] = await Promise.all([
    listTickets({
      status: status && status in ticketStatusAdmin ? status : undefined,
      open: status ? undefined : view === "offen" ? true : view === "erledigt" ? false : undefined,
      priority: priority in ticketPriority ? priority : undefined,
      assignee: assignee === "ich" ? admin.id : assignee === "keine" ? "none" : undefined,
      q: q || undefined,
    }),
    query<{ id: string; name: string }>("select id, name from app_users where role = 'admin' and active order by name"),
  ]);
  return (
    <>
      <PageHeader eyebrow="Support" title="Tickets" lead={`${tickets.length} Tickets in dieser Ansicht`} />
      <Flash params={params} />
      <form className="filters" role="search">
        <input name="q" defaultValue={q} placeholder="Suche: Betreff, Kunde, Nummer" aria-label="Suche" />
        <Select name="ansicht" defaultValue={view === "status" ? "offen" : view} aria-label="Ansicht">
          <option value="offen">Offen</option>
          <option value="erledigt">Gelöst & geschlossen</option>
          <option value="alle">Alle</option>
        </Select>
        <Select name="status" defaultValue={status} aria-label="Status">
          <option value="">Jeder Status</option>
          {Object.entries(ticketStatusAdmin).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
        <Select name="prioritaet" defaultValue={priority} aria-label="Priorität">
          <option value="">Jede Priorität</option>
          {Object.entries(ticketPriority).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
        <Select name="zustaendig" defaultValue={assignee} aria-label="Zuständig">
          <option value="">Alle Zuständigen</option>
          <option value="ich">Mir zugewiesen</option>
          <option value="keine">Nicht zugewiesen</option>
        </Select>
        <button className="btn btn-ghost btn-sm">Filtern</button>
        {(q || status || priority || assignee || view !== "offen") && (
          <Link href="/admin/tickets" className="link-more">
            Zurücksetzen
          </Link>
        )}
      </form>
      <Card flush>
        {tickets.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Kunde</th>
                <th>Kategorie</th>
                <th>Priorität</th>
                <th>Status</th>
                <th>Zuständig</th>
                <th>Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className={t.status === "offen" && t.last_author_role !== "admin" ? "row-attention" : undefined}
                >
                  <td>
                    <Link href={`/admin/tickets/${t.id}`} className="table-link">
                      <b>{t.subject}</b>
                      <small>
                        {ticketNo(t.number)} · {t.message_count} Nachrichten
                      </small>
                    </Link>
                  </td>
                  <td>
                    <b className="block">{t.organisation || "–"}</b>
                    <small className="muted-text">{t.customer_name}</small>
                  </td>
                  <td>{ticketCategory[t.category as keyof typeof ticketCategory]}</td>
                  <td>
                    <Badge tone={priorityTone[t.priority]}>
                      {ticketPriority[t.priority as keyof typeof ticketPriority]}
                    </Badge>
                  </td>
                  <td>
                    <Badge tone={ticketTone[t.status]}>
                      {ticketStatusAdmin[t.status as keyof typeof ticketStatusAdmin]}
                    </Badge>
                  </td>
                  <td>{t.assignee_name ?? <span className="muted-text">–</span>}</td>
                  <td className="nowrap">{dateTime(t.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Keine Tickets in dieser Ansicht" />
        )}
      </Card>
      <p className="card-note">
        Hervorgehoben: offene Tickets, deren letzte Nachricht von der Kundschaft stammt. Zuständige:{" "}
        {admins.map((a) => a.name).join(", ")}.
      </p>
    </>
  );
}
