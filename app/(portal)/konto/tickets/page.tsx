import type { Metadata } from "next";
import Link from "next/link";
import { Lifebuoy } from "@phosphor-icons/react/dist/ssr";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { dateTime, ticketNo } from "@/lib/format";
import { priorityTone, ticketCategory, ticketPriority, ticketStatus, ticketTone } from "@/lib/labels";
import { listTickets } from "@/lib/tickets";

export const metadata: Metadata = { title: "Support-Tickets" };

export default async function TicketsPage({ searchParams }: PageProps<"/konto/tickets">) {
  const user = await requireUser();
  const params = await searchParams;
  const view = params.ansicht === "erledigt" ? "erledigt" : "offen";
  const tickets = await listTickets({ customerId: user.id, open: view === "offen" });
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Support-Tickets"
        lead="Fragen, Störungen und Wünsche an das CareCore-Team – mit vollständigem Verlauf."
        actions={
          <Link href="/konto/tickets/neu" className="btn btn-primary">
            <Lifebuoy size={18} /> Neues Ticket
          </Link>
        }
      />
      <Flash params={params} />
      <nav className="tabs" aria-label="Filter">
        <Link href="/konto/tickets" className={view === "offen" ? "is-active" : undefined}>
          Offen
        </Link>
        <Link href="/konto/tickets?ansicht=erledigt" className={view === "erledigt" ? "is-active" : undefined}>
          Gelöst & geschlossen
        </Link>
      </nav>
      <Card flush>
        {tickets.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Kategorie</th>
                <th>Priorität</th>
                <th>Status</th>
                <th>Aktualisiert</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/konto/tickets/${t.id}`} className="table-link">
                      <b>{t.subject}</b>
                      <small>{ticketNo(t.number)}</small>
                    </Link>
                  </td>
                  <td>{ticketCategory[t.category as keyof typeof ticketCategory]}</td>
                  <td>
                    <Badge tone={priorityTone[t.priority]}>
                      {ticketPriority[t.priority as keyof typeof ticketPriority]}
                    </Badge>
                  </td>
                  <td>
                    <Badge tone={ticketTone[t.status]}>{ticketStatus[t.status as keyof typeof ticketStatus]}</Badge>
                  </td>
                  <td className="nowrap">{dateTime(t.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty
            title={view === "offen" ? "Keine offenen Tickets" : "Noch keine erledigten Tickets"}
            text="Neue Anliegen erfassen Sie mit „Neues Ticket“."
          />
        )}
      </Card>
    </>
  );
}
