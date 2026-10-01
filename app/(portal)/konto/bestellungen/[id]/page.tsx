import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelOwnOrder } from "@/app/actions/orders";
import OrderItemsTable from "@/app/components/order-items-table";
import SubmitButton from "@/app/components/submit-button";
import { Badge, Card, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { date, dateTime, invoiceNo, money, orderNo } from "@/lib/format";
import { invoiceStatus, invoiceTone, orderStatus, orderTone } from "@/lib/labels";
import { getOrder, listInvoices, orderItems } from "@/lib/orders";

export const metadata: Metadata = { title: "Bestellung" };

export default async function OrderPage({ params, searchParams }: PageProps<"/konto/bestellungen/[id]">) {
  const user = await requireUser();
  const order = await getOrder((await params).id);
  if (!order || order.customer_id !== user.id) notFound();
  const [items, invoices] = await Promise.all([orderItems(order.id), listInvoices({ orderId: order.id })]);
  return (
    <>
      <PageHeader
        back={{ href: "/konto/bestellungen", label: "Bestellungen" }}
        eyebrow={`Bestellt am ${date(order.created_at)}`}
        title={`Bestellung ${orderNo(order.number)}`}
        actions={
          <>
            <Badge tone={orderTone[order.status]}>{orderStatus[order.status as keyof typeof orderStatus]}</Badge>
            {order.status === "angefragt" && (
              <form action={cancelOwnOrder}>
                <input type="hidden" name="order_id" value={order.id} />
                <SubmitButton className="btn btn-ghost btn-sm" confirm="Bestellung wirklich stornieren?">
                  Stornieren
                </SubmitButton>
              </form>
            )}
          </>
        }
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack-lg">
          <Card title="Positionen" flush>
            <OrderItemsTable items={items} />
          </Card>
          {order.customer_note && (
            <Card title="Ihre Bemerkung">
              <p className="pre">{order.customer_note}</p>
            </Card>
          )}
        </div>
        <aside className="detail-side">
          <Card title="Rechnungen" flush>
            {invoices.length ? (
              <ul className="list">
                {invoices.map((i) => (
                  <li key={i.id}>
                    <Link href={`/konto/rechnungen/${i.id}`}>
                      <span className="list-main">
                        <b>{invoiceNo(i.number, i.issued_on)}</b>
                        <small>{money(i.total_cents)}</small>
                      </span>
                      <Badge tone={invoiceTone[i.status]}>
                        {invoiceStatus[i.status as keyof typeof invoiceStatus]}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card-note">Die Rechnung erscheint hier, sobald sie erstellt ist.</p>
            )}
          </Card>
          <Card title="Fragen zur Bestellung?">
            <p className="card-note">Zuletzt aktualisiert {dateTime(order.updated_at)}.</p>
            <Link href="/konto/tickets/neu" className="btn btn-ghost btn-sm">
              Ticket erstellen
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}
