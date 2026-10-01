import type { Metadata } from "next";
import Link from "next/link";
import { CreateCustomerForm } from "@/app/components/admin-forms";
import { Badge, Card, Empty, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { date, dateTime, money } from "@/lib/format";

export const metadata: Metadata = { title: "Kundschaft" };

type Row = {
  id: string;
  name: string;
  email: string;
  organisation: string;
  role: string;
  active: boolean;
  created_at: Date;
  last_login_at: Date | null;
  open_tickets: number;
  orders: number;
  open_cents: number;
};

export default async function CustomersPage({ searchParams }: PageProps<"/admin/kunden">) {
  await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.slice(0, 80) : "";
  const rows = await query<Row>(
    `select u.id, u.name, u.email, u.organisation, u.role, u.active, u.created_at, u.last_login_at,
       (select count(*)::int from tickets t where t.customer_id = u.id and t.status not in ('geloest','geschlossen')) as open_tickets,
       (select count(*)::int from orders o where o.customer_id = u.id) as orders,
       (select coalesce(sum(total_cents),0)::int from invoices i where i.customer_id = u.id and i.status = 'offen') as open_cents
     from app_users u
     where ($1 = '' or u.name ilike '%' || $1 || '%' or u.email ilike '%' || $1 || '%' or u.organisation ilike '%' || $1 || '%')
     order by u.role, u.organisation, u.name limit 500`,
    [q],
  );
  return (
    <>
      <PageHeader eyebrow="Kundschaft" title="Konten" lead={`${rows.length} Konten`} />
      <div className="detail-layout">
        <div className="stack">
          <form className="filters" role="search">
            <input name="q" defaultValue={q} placeholder="Suche: Name, E-Mail, Einrichtung" aria-label="Suche" />
            <button className="btn btn-ghost btn-sm">Suchen</button>
          </form>
          <Card flush>
            {rows.length ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Einrichtung / Person</th>
                    <th>Rolle</th>
                    <th className="num">Tickets offen</th>
                    <th className="num">Bestellungen</th>
                    <th className="num">Offen</th>
                    <th>Letzte Anmeldung</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/admin/kunden/${r.id}`} className="table-link">
                          <b>{r.organisation || r.name}</b>
                          <small>
                            {r.name} · {r.email}
                          </small>
                        </Link>
                      </td>
                      <td>
                        {r.role === "admin" ? <Badge tone="brand">Administration</Badge> : <Badge>Kunde</Badge>}
                        {!r.active && <Badge tone="critical">Gesperrt</Badge>}
                      </td>
                      <td className="num">{r.open_tickets}</td>
                      <td className="num">{r.orders}</td>
                      <td className="num">{r.open_cents ? money(r.open_cents) : "–"}</td>
                      <td className="nowrap">
                        {r.last_login_at ? dateTime(r.last_login_at) : `seit ${date(r.created_at)} nie`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty title="Keine Konten gefunden" />
            )}
          </Card>
        </div>
        <aside className="detail-side">
          <Card title="Konto anlegen">
            <p className="card-note">
              Für Kundschaft, die sich nicht selbst registriert. Das Startpasswort wird einmal angezeigt.
            </p>
            <CreateCustomerForm />
          </Card>
        </aside>
      </div>
    </>
  );
}
