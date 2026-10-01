import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { customerReply, customerSetOpen } from "@/app/actions/tickets";
import FileInput from "@/app/components/file-input";
import SubmitButton from "@/app/components/submit-button";
import TicketThread from "@/app/components/ticket-thread";
import { Badge, Card, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { dateTime, orderNo, ticketNo } from "@/lib/format";
import { priorityTone, ticketCategory, ticketPriority, ticketStatus, ticketTone } from "@/lib/labels";
import { getTicket, ticketThread } from "@/lib/tickets";

export const metadata: Metadata = { title: "Ticket" };

export default async function TicketPage({ params, searchParams }: PageProps<"/konto/tickets/[id]">) {
  const user = await requireUser();
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket || ticket.customer_id !== user.id) notFound();
  const { messages, attachments } = await ticketThread(ticket.id, false);
  const closed = ticket.status === "geschlossen";
  return (
    <>
      <PageHeader
        back={{ href: "/konto/tickets", label: "Tickets" }}
        eyebrow={ticketNo(ticket.number)}
        title={ticket.subject}
        actions={
          <form action={customerSetOpen}>
            <input type="hidden" name="ticket_id" value={ticket.id} />
            {closed ? (
              <SubmitButton className="btn btn-ghost" name="action" value="open">
                Wieder öffnen
              </SubmitButton>
            ) : (
              <SubmitButton className="btn btn-ghost" name="action" value="close" confirm="Ticket schliessen?">
                Ticket schliessen
              </SubmitButton>
            )}
          </form>
        }
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack-lg">
          <TicketThread messages={messages} attachments={attachments} viewer="customer" />
          <div id="ende" />
          {closed ? (
            <p className="flash">Dieses Ticket ist geschlossen. Öffnen Sie es wieder, um zu antworten.</p>
          ) : (
            <Card title="Antworten">
              <form action={customerReply} className="stack">
                <input type="hidden" name="ticket_id" value={ticket.id} />
                <label className="field">
                  <span className="sr-only">Nachricht</span>
                  <textarea name="body" rows={5} required placeholder="Ihre Nachricht an das Support-Team" />
                </label>
                <FileInput />
                <div className="form-actions">
                  <SubmitButton pendingText="Wird gesendet …">Nachricht senden</SubmitButton>
                </div>
              </form>
            </Card>
          )}
        </div>
        <aside className="detail-side">
          <Card title="Details">
            <dl className="facts">
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge tone={ticketTone[ticket.status]}>
                    {ticketStatus[ticket.status as keyof typeof ticketStatus]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Priorität</dt>
                <dd>
                  <Badge tone={priorityTone[ticket.priority]}>
                    {ticketPriority[ticket.priority as keyof typeof ticketPriority]}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt>Kategorie</dt>
                <dd>{ticketCategory[ticket.category as keyof typeof ticketCategory]}</dd>
              </div>
              <div>
                <dt>Bearbeitung</dt>
                <dd>{ticket.assignee_name ?? "Noch nicht zugewiesen"}</dd>
              </div>
              {ticket.order_id && (
                <div>
                  <dt>Bestellung</dt>
                  <dd>
                    <Link href={`/konto/bestellungen/${ticket.order_id}`}>{orderNo(ticket.order_number ?? 0)}</Link>
                  </dd>
                </div>
              )}
              <div>
                <dt>Erstellt</dt>
                <dd>{dateTime(ticket.created_at)}</dd>
              </div>
              <div>
                <dt>Aktualisiert</dt>
                <dd>{dateTime(ticket.updated_at)}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </>
  );
}
