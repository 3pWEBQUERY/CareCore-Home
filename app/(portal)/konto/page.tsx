import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lifebuoy, Package, Receipt } from "@phosphor-icons/react/dist/ssr";
import { Badge, Card, Empty, PageHeader, Stat } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { date, dateTime, invoiceNo, money, orderNo, ticketNo } from "@/lib/format";
import { invoiceStatus, invoiceTone, orderStatus, orderTone, ticketStatus, ticketTone } from "@/lib/labels";
import { listTickets } from "@/lib/tickets";

export const metadata: Metadata = { title: "Kundenportal" };

export default async function KontoPage({ searchParams }: PageProps<"/konto">) {
  const user = await requireUser();
  const { willkommen } = await searchParams;
  const [tickets, orders, invoices, sums] = await Promise.all([
    listTickets({ customerId: user.id, open: true, limit: 5 }),
    query<{ id: string; number: number; status: string; created_at: Date }>(
      "select id, number, status, created_at from orders where customer_id = $1 order by created_at desc limit 5",
      [user.id],
    ),
    query<{ id: string; number: number; status: string; issued_on: Date; due_on: Date; total_cents: number }>(
      `select id, number, status, issued_on, due_on, total_cents from invoices
       where customer_id = $1 and status = 'offen' order by due_on limit 5`,
      [user.id],
    ),
    queryOne<{ open_tickets: number; orders: number; open_cents: number }>(
      `select (select count(*)::int from tickets where customer_id = $1 and status not in ('geloest','geschlossen')) as open_tickets,
              (select count(*)::int from orders where customer_id = $1) as orders,
              (select coalesce(sum(total_cents), 0)::int from invoices where customer_id = $1 and status = 'offen') as open_cents`,
      [user.id],
    ),
  ]);
  const firstName = user.name.split(" ")[0];

  return (
    <>
      <PageHeader
        eyebrow="Kundenportal"
        title={`Grüezi, ${firstName}`}
        lead={user.organisation ? `Ihr Konto für ${user.organisation}.` : undefined}
        actions={
          <Link href="/konto/tickets/neu" className="btn btn-primary">
            <Lifebuoy size={18} /> Neues Ticket
          </Link>
        }
      />
      {willkommen && (
        <p className="flash flash-ok">
          Willkommen bei CareCore! Ihr Konto ist eingerichtet. Ergänzen Sie unter Profil Ihre Rechnungsadresse.
        </p>
      )}
      <div className="stats">
        <Stat label="Offene Tickets" value={sums?.open_tickets ?? 0} />
        <Stat label="Bestellungen" value={sums?.orders ?? 0} />
        <Stat
          label="Offene Rechnungen"
          value={money(sums?.open_cents ?? 0)}
          tone={sums?.open_cents ? "attention" : undefined}
        />
      </div>

      <div className="grid-2">
        <Card
          title="Offene Tickets"
          eyebrow="Support"
          actions={
            <Link href="/konto/tickets" className="link-more">
              Alle <ArrowRight size={14} />
            </Link>
          }
          flush
        >
          {tickets.length ? (
            <ul className="list">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link href={`/konto/tickets/${t.id}`}>
                    <span className="list-main">
                      <b>{t.subject}</b>
                      <small>
                        {ticketNo(t.number)} · aktualisiert {dateTime(t.updated_at)}
                      </small>
                    </span>
                    <Badge tone={ticketTone[t.status]}>{ticketStatus[t.status as keyof typeof ticketStatus]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Keine offenen Tickets" text="Haben Sie eine Frage? Wir helfen gerne." />
          )}
        </Card>

        <Card
          title="Offene Rechnungen"
          eyebrow="Abrechnung"
          actions={
            <Link href="/konto/rechnungen" className="link-more">
              Alle <ArrowRight size={14} />
            </Link>
          }
          flush
        >
          {invoices.length ? (
            <ul className="list">
              {invoices.map((i) => (
                <li key={i.id}>
                  <Link href={`/konto/rechnungen/${i.id}`}>
                    <span className="list-main">
                      <b>{invoiceNo(i.number, i.issued_on)}</b>
                      <small>fällig {date(i.due_on)}</small>
                    </span>
                    <span className="list-amount">{money(i.total_cents)}</span>
                    <Badge tone={invoiceTone[i.status]}>{invoiceStatus[i.status as keyof typeof invoiceStatus]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Keine offenen Rechnungen" />
          )}
        </Card>
      </div>

      <Card
        title="Letzte Bestellungen"
        eyebrow="Bestellungen"
        actions={
          <Link href="/konto/bestellungen/neu" className="btn btn-ghost btn-sm">
            <Package size={16} /> Bestellen
          </Link>
        }
        flush
      >
        {orders.length ? (
          <ul className="list">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/konto/bestellungen/${o.id}`}>
                  <span className="list-main">
                    <b>Bestellung {orderNo(o.number)}</b>
                    <small>{date(o.created_at)}</small>
                  </span>
                  <Badge tone={orderTone[o.status]}>{orderStatus[o.status as keyof typeof orderStatus]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            title="Noch keine Bestellungen"
            text="Lizenzen, Einführung und Schulungen bestellen Sie direkt hier im Portal."
            action={
              <Link href="/konto/bestellungen/neu" className="btn btn-ghost btn-sm">
                <Receipt size={16} /> Zum Angebot
              </Link>
            }
          />
        )}
      </Card>
    </>
  );
}
