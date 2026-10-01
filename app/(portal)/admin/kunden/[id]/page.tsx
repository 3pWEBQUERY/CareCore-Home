import Select from "@/app/components/select";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminUpdateCustomer } from "@/app/actions/account";
import { adminCreateOrder } from "@/app/actions/orders";
import { ResetPasswordForm } from "@/app/components/admin-forms";
import SubmitButton from "@/app/components/submit-button";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { queryOne } from "@/lib/db";
import { date, dateTime, invoiceNo, money, orderNo, ticketNo } from "@/lib/format";
import { invoiceStatus, invoiceTone, orderStatus, orderTone, ticketStatusAdmin, ticketTone } from "@/lib/labels";
import { listInvoices, listOrders } from "@/lib/orders";
import { listTickets } from "@/lib/tickets";

export const metadata: Metadata = { title: "Konto" };

type Customer = {
  id: string;
  name: string;
  email: string;
  organisation: string;
  role_title: string;
  phone: string;
  street: string;
  zip_city: string;
  country: string;
  role: string;
  active: boolean;
  created_at: Date;
  last_login_at: Date | null;
};

export default async function CustomerPage({ params, searchParams }: PageProps<"/admin/kunden/[id]">) {
  const admin = await requireAdmin();
  const { id } = await params;
  const c = /^[0-9a-f-]{36}$/.test(id) ? await queryOne<Customer>("select * from app_users where id = $1", [id]) : null;
  if (!c) notFound();
  const [tickets, orders, invoices] = await Promise.all([
    listTickets({ customerId: c.id, limit: 20 }),
    listOrders({ customerId: c.id }),
    listInvoices({ customerId: c.id }),
  ]);
  return (
    <>
      <PageHeader
        back={{ href: "/admin/kunden", label: "Kundschaft" }}
        eyebrow={c.role === "admin" ? "Administration" : "Kundenkonto"}
        title={c.organisation || c.name}
        lead={`${c.name} · ${c.email} · registriert ${date(c.created_at)} · zuletzt angemeldet ${dateTime(c.last_login_at)}`}
        actions={
          <form action={adminCreateOrder}>
            <input type="hidden" name="customer_id" value={c.id} />
            <SubmitButton>Bestellung anlegen</SubmitButton>
          </form>
        }
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack-lg">
          <Card title="Tickets" flush>
            {tickets.length ? (
              <ul className="list">
                {tickets.map((t) => (
                  <li key={t.id}>
                    <Link href={`/admin/tickets/${t.id}`}>
                      <span className="list-main">
                        <b>{t.subject}</b>
                        <small>
                          {ticketNo(t.number)} · {dateTime(t.updated_at)}
                        </small>
                      </span>
                      <Badge tone={ticketTone[t.status]}>
                        {ticketStatusAdmin[t.status as keyof typeof ticketStatusAdmin]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Keine Tickets" />
            )}
          </Card>
          <Card title="Bestellungen" flush>
            {orders.length ? (
              <ul className="list">
                {orders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/bestellungen/${o.id}`}>
                      <span className="list-main">
                        <b>{orderNo(o.number)}</b>
                        <small>{date(o.created_at)}</small>
                      </span>
                      <span className="list-amount">{money(o.total_cents)}</span>
                      <Badge tone={orderTone[o.status]}>{orderStatus[o.status as keyof typeof orderStatus]}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Keine Bestellungen" />
            )}
          </Card>
          <Card title="Rechnungen" flush>
            {invoices.length ? (
              <ul className="list">
                {invoices.map((i) => (
                  <li key={i.id}>
                    <Link href={`/admin/rechnungen/${i.id}`}>
                      <span className="list-main">
                        <b>{invoiceNo(i.number, i.issued_on)}</b>
                        <small>fällig {date(i.due_on)}</small>
                      </span>
                      <span className="list-amount">{money(i.total_cents)}</span>
                      <Badge tone={invoiceTone[i.status]}>
                        {invoiceStatus[i.status as keyof typeof invoiceStatus]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Keine Rechnungen" />
            )}
          </Card>
        </div>
        <aside className="detail-side">
          <Card title="Stammdaten">
            <form action={adminUpdateCustomer} className="stack">
              <input type="hidden" name="user_id" value={c.id} />
              <label className="field">
                <span>Name</span>
                <input name="name" required defaultValue={c.name} />
              </label>
              <label className="field">
                <span>E-Mail</span>
                <input name="email" type="email" required defaultValue={c.email} />
              </label>
              <label className="field">
                <span>Einrichtung</span>
                <input name="organisation" defaultValue={c.organisation} />
              </label>
              <label className="field">
                <span>Funktion</span>
                <input name="role_title" defaultValue={c.role_title} />
              </label>
              <label className="field">
                <span>Telefon</span>
                <input name="phone" defaultValue={c.phone} />
              </label>
              <label className="field">
                <span>Strasse, Nr.</span>
                <input name="street" defaultValue={c.street} />
              </label>
              <label className="field">
                <span>PLZ, Ort</span>
                <input name="zip_city" defaultValue={c.zip_city} />
              </label>
              <label className="field">
                <span>Land</span>
                <input name="country" defaultValue={c.country} />
              </label>
              <label className="field">
                <span>Rolle</span>
                <Select name="role" defaultValue={c.role} disabled={c.id === admin.id}>
                  <option value="customer">Kunde</option>
                  <option value="admin">Administration</option>
                </Select>
                {c.id === admin.id && <input type="hidden" name="role" value="admin" />}
              </label>
              <label className="check">
                <input type="checkbox" name="active" defaultChecked={c.active} disabled={c.id === admin.id} />
                <span>Konto aktiv</span>
                {c.id === admin.id && <input type="hidden" name="active" value="on" />}
              </label>
              <SubmitButton className="btn btn-primary btn-block">Speichern</SubmitButton>
            </form>
          </Card>
          {c.id !== admin.id && (
            <Card title="Passwort">
              <ResetPasswordForm userId={c.id} />
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
