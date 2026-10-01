import Select from "@/app/components/select";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminDeleteTicket, adminReply, adminUpdateTicket } from "@/app/actions/tickets";
import FileInput from "@/app/components/file-input";
import SubmitButton from "@/app/components/submit-button";
import TicketThread from "@/app/components/ticket-thread";
import { Card, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { dateTime, orderNo, ticketNo } from "@/lib/format";
import { ticketCategory, ticketPriority, ticketStatusAdmin } from "@/lib/labels";
import { getTicket, ticketEvents, ticketThread } from "@/lib/tickets";

export const metadata: Metadata = { title: "Ticket" };

export default async function AdminTicketPage({ params, searchParams }: PageProps<"/admin/tickets/[id]">) {
  await requireAdmin();
  const ticket = await getTicket((await params).id);
  if (!ticket) notFound();
  const [{ messages, attachments }, events, admins, other] = await Promise.all([
    ticketThread(ticket.id, true),
    ticketEvents(ticket.id),
    query<{ id: string; name: string }>("select id, name from app_users where role = 'admin' and active order by name"),
    query<{ id: string; number: number; subject: string; status: string }>(
      "select id, number, subject, status from tickets where customer_id = $1 and id <> $2 order by updated_at desc limit 5",
      [ticket.customer_id, ticket.id],
    ),
  ]);
  return (
    <>
      <PageHeader
        back={{ href: "/admin/tickets", label: "Tickets" }}
        eyebrow={ticketNo(ticket.number)}
        title={ticket.subject}
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack-lg">
          <TicketThread messages={messages} attachments={attachments} events={events} viewer="admin" />
          <div id="ende" />
          <Card title="Antworten">
            <form action={adminReply} className="stack">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <label className="field">
                <span className="sr-only">Nachricht</span>
                <textarea name="body" rows={6} required placeholder={`Antwort an ${ticket.customer_name}`} />
              </label>
              <FileInput />
              <div className="reply-options">
                <label className="check">
                  <input type="checkbox" name="internal" />
                  <span>Interne Notiz (nur für die Administration sichtbar)</span>
                </label>
                <label className="field field-inline">
                  <span>Status danach</span>
                  <Select name="next_status" defaultValue="wartet_auf_kunde">
                    {Object.entries(ticketStatusAdmin).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </Select>
                </label>
              </div>
              <div className="form-actions">
                <SubmitButton pendingText="Wird gesendet …">Senden</SubmitButton>
              </div>
            </form>
          </Card>
        </div>
        <aside className="detail-side">
          <Card title="Bearbeitung">
            <form action={adminUpdateTicket} className="stack">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <label className="field">
                <span>Status</span>
                <Select name="status" defaultValue={ticket.status}>
                  {Object.entries(ticketStatusAdmin).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="field">
                <span>Priorität</span>
                <Select name="priority" defaultValue={ticket.priority}>
                  {Object.entries(ticketPriority).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="field">
                <span>Kategorie</span>
                <Select name="category" defaultValue={ticket.category}>
                  {Object.entries(ticketCategory).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="field">
                <span>Zuständig</span>
                <Select name="assignee_id" defaultValue={ticket.assignee_id ?? ""}>
                  <option value="">Niemand</option>
                  {admins.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              </label>
              <SubmitButton className="btn btn-primary btn-block">Übernehmen</SubmitButton>
            </form>
          </Card>
          <Card title="Kunde">
            <dl className="facts">
              <div>
                <dt>Einrichtung</dt>
                <dd>{ticket.organisation || "–"}</dd>
              </div>
              <div>
                <dt>Person</dt>
                <dd>
                  <Link href={`/admin/kunden/${ticket.customer_id}`}>{ticket.customer_name}</Link>
                </dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>
                  <a href={`mailto:${ticket.customer_email}`}>{ticket.customer_email}</a>
                </dd>
              </div>
              {ticket.order_id && (
                <div>
                  <dt>Bestellung</dt>
                  <dd>
                    <Link href={`/admin/bestellungen/${ticket.order_id}`}>{orderNo(ticket.order_number ?? 0)}</Link>
                  </dd>
                </div>
              )}
              <div>
                <dt>Erstellt</dt>
                <dd>{dateTime(ticket.created_at)}</dd>
              </div>
            </dl>
          </Card>
          {other.length > 0 && (
            <Card title="Weitere Tickets" flush>
              <ul className="list">
                {other.map((t) => (
                  <li key={t.id}>
                    <Link href={`/admin/tickets/${t.id}`}>
                      <span className="list-main">
                        <b>{t.subject}</b>
                        <small>
                          {ticketNo(t.number)} · {ticketStatusAdmin[t.status as keyof typeof ticketStatusAdmin]}
                        </small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          <form action={adminDeleteTicket}>
            <input type="hidden" name="ticket_id" value={ticket.id} />
            <SubmitButton
              className="btn btn-danger-link"
              confirm="Ticket mit allen Nachrichten und Anhängen endgültig löschen?"
            >
              Ticket löschen
            </SubmitButton>
          </form>
        </aside>
      </div>
    </>
  );
}
