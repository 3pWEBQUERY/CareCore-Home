import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Badge, Card, Empty, PageHeader, Stat } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { dateTime, money, orderNo, ticketNo } from "@/lib/format";
import {
  demoStatus,
  demoTone,
  orderStatus,
  orderTone,
  priorityTone,
  ticketPriority,
  ticketStatusAdmin,
  ticketTone,
} from "@/lib/labels";
import { listTickets } from "@/lib/tickets";
import { listOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Administration" };

export default async function AdminPage() {
  const admin = await requireAdmin();
  const [stats, tickets, mine, requests, orders] = await Promise.all([
    queryOne<{
      open: number;
      urgent: number;
      waiting: number;
      customers: number;
      new_customers: number;
      open_cents: number;
      overdue_cents: number;
      paid_month_cents: number;
    }>(`select
        (select count(*)::int from tickets where status not in ('geloest','geschlossen')) as open,
        (select count(*)::int from tickets where status not in ('geloest','geschlossen') and priority in ('hoch','dringend')) as urgent,
        (select count(*)::int from tickets where status = 'wartet_auf_kunde') as waiting,
        (select count(*)::int from app_users where role = 'customer') as customers,
        (select count(*)::int from app_users where role = 'customer' and created_at > now() - interval '30 days') as new_customers,
        (select coalesce(sum(total_cents),0)::int from invoices where status = 'offen') as open_cents,
        (select coalesce(sum(total_cents),0)::int from invoices where status = 'offen' and due_on < current_date) as overdue_cents,
        (select coalesce(sum(total_cents),0)::int from invoices where status = 'bezahlt' and paid_on >= date_trunc('month', current_date)) as paid_month_cents`),
    listTickets({ open: true, limit: 8 }),
    listTickets({ open: true, assignee: admin.id, limit: 50 }),
    query<{ id: string; organisation: string; name: string; status: string; created_at: Date }>(
      "select id, organisation, name, status, created_at from demo_requests where status <> 'erledigt' order by created_at desc limit 5",
    ),
    listOrders({ status: "angefragt" }),
  ]);
  return (
    <>
      <PageHeader eyebrow="Administration" title="Übersicht" lead={`Angemeldet als ${admin.name}`} />
      <div className="stats stats-4">
        <Stat
          label="Offene Tickets"
          value={stats?.open ?? 0}
          hint={`${stats?.urgent ?? 0} hoch/dringend · ${mine.length} bei mir`}
          tone={stats?.urgent ? "attention" : undefined}
        />
        <Stat label="Wartet auf Kundschaft" value={stats?.waiting ?? 0} />
        <Stat label="Kundschaft" value={stats?.customers ?? 0} hint={`${stats?.new_customers ?? 0} neu in 30 Tagen`} />
        <Stat
          label="Offene Rechnungen"
          value={money(stats?.open_cents ?? 0)}
          hint={`${money(stats?.overdue_cents ?? 0)} überfällig · ${money(stats?.paid_month_cents ?? 0)} bezahlt diesen Monat`}
          tone={stats?.overdue_cents ? "critical" : undefined}
        />
      </div>
      <Card
        title="Offene Tickets nach Dringlichkeit"
        eyebrow="Support"
        actions={
          <Link href="/admin/tickets" className="link-more">
            Alle <ArrowRight size={14} />
          </Link>
        }
        flush
      >
        {tickets.length ? (
          <table className="table">
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/admin/tickets/${t.id}`} className="table-link">
                      <b>{t.subject}</b>
                      <small>
                        {ticketNo(t.number)} · {t.organisation || t.customer_name}
                      </small>
                    </Link>
                  </td>
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
                  <td className="muted-text">{t.assignee_name ?? "nicht zugewiesen"}</td>
                  <td className="nowrap muted-text">{dateTime(t.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Keine offenen Tickets" />
        )}
      </Card>
      <div className="grid-2">
        <Card title="Neue Bestellungen" eyebrow="Zu bestätigen" flush>
          {orders.length ? (
            <ul className="list">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/bestellungen/${o.id}`}>
                    <span className="list-main">
                      <b>
                        {orderNo(o.number)} · {o.organisation || o.customer_name}
                      </b>
                      <small>{dateTime(o.created_at)}</small>
                    </span>
                    <span className="list-amount">{money(o.total_cents)}</span>
                    <Badge tone={orderTone[o.status]}>{orderStatus[o.status as keyof typeof orderStatus]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Keine neuen Bestellungen" />
          )}
        </Card>
        <Card title="Demo-Anfragen" eyebrow="Vertrieb" flush>
          {requests.length ? (
            <ul className="list">
              {requests.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/anfragen#${r.id}`}>
                    <span className="list-main">
                      <b>{r.organisation}</b>
                      <small>
                        {r.name} · {dateTime(r.created_at)}
                      </small>
                    </span>
                    <Badge tone={demoTone[r.status]}>{demoStatus[r.status as keyof typeof demoStatus]}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Keine offenen Anfragen" />
          )}
        </Card>
      </div>
    </>
  );
}
