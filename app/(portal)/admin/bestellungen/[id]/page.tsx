import Select from "@/app/components/select";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminAddItem, adminCreateInvoice, adminRemoveItem, adminUpdateOrder } from "@/app/actions/orders";
import OrderItemsTable from "@/app/components/order-items-table";
import SubmitButton from "@/app/components/submit-button";
import { Badge, Card, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { date, invoiceNo, money, orderNo } from "@/lib/format";
import { invoiceStatus, invoiceTone, orderStatus, orderTone, units } from "@/lib/labels";
import { getOrder, listInvoices, orderItems } from "@/lib/orders";

export const metadata: Metadata = { title: "Bestellung" };

export default async function AdminOrderPage({ params, searchParams }: PageProps<"/admin/bestellungen/[id]">) {
  await requireAdmin();
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const [items, invoices, products] = await Promise.all([
    orderItems(order.id),
    listInvoices({ orderId: order.id }),
    query<{ id: string; name: string; price_cents: number; unit: string }>(
      "select id, name, price_cents, unit from products where active order by sort, name",
    ),
  ]);
  const editable = order.status !== "storniert";
  return (
    <>
      <PageHeader
        back={{ href: "/admin/bestellungen", label: "Bestellungen" }}
        eyebrow={`Bestellt ${date(order.created_at)}`}
        title={`Bestellung ${orderNo(order.number)}`}
        lead={
          <>
            <Link href={`/admin/kunden/${order.customer_id}`}>{order.organisation || order.customer_name}</Link> ·{" "}
            {order.customer_email}
          </>
        }
        actions={<Badge tone={orderTone[order.status]}>{orderStatus[order.status as keyof typeof orderStatus]}</Badge>}
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack-lg">
          <Card title="Positionen" flush>
            <OrderItemsTable
              items={items}
              action={
                editable
                  ? (item) => (
                      <form action={adminRemoveItem}>
                        <input type="hidden" name="order_id" value={order.id} />
                        <input type="hidden" name="item_id" value={item.id} />
                        <SubmitButton className="btn btn-danger-link" confirm="Position entfernen?">
                          Entfernen
                        </SubmitButton>
                      </form>
                    )
                  : undefined
              }
            />
          </Card>
          {editable && (
            <Card title="Position hinzufügen">
              <form action={adminAddItem} className="stack">
                <input type="hidden" name="order_id" value={order.id} />
                <label className="field">
                  <span>Produkt (optional)</span>
                  <Select name="product_id" defaultValue="">
                    <option value="">Freie Position</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} – {money(p.price_cents)} / {p.unit}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="field">
                  <span>Beschreibung (leer = Produktname)</span>
                  <input name="description" maxLength={300} />
                </label>
                <div className="field-grid field-grid-4">
                  <label className="field">
                    <span>Menge</span>
                    <input name="quantity" required defaultValue="1" inputMode="decimal" />
                  </label>
                  <label className="field">
                    <span>Einheit</span>
                    <Select name="unit" defaultValue="">
                      <option value="">wie Produkt</option>
                      {units.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </Select>
                  </label>
                  <label className="field">
                    <span>Preis CHF (leer = Produkt)</span>
                    <input name="price" inputMode="decimal" placeholder="0.00" />
                  </label>
                  <label className="field">
                    <span>MWST %</span>
                    <input name="vat_rate" inputMode="decimal" placeholder="8.1" />
                  </label>
                </div>
                <div className="form-actions">
                  <SubmitButton className="btn btn-ghost">Hinzufügen</SubmitButton>
                </div>
              </form>
            </Card>
          )}
          {order.customer_note && (
            <Card title="Bemerkung der Kundschaft">
              <p className="pre">{order.customer_note}</p>
            </Card>
          )}
        </div>
        <aside className="detail-side">
          <Card title="Status">
            <form action={adminUpdateOrder} className="stack">
              <input type="hidden" name="order_id" value={order.id} />
              <label className="field">
                <span>Status</span>
                <Select name="status" defaultValue={order.status}>
                  {Object.entries(orderStatus).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="field">
                <span>Interne Notiz</span>
                <textarea name="internal_note" rows={3} defaultValue={order.internal_note} />
              </label>
              <SubmitButton className="btn btn-primary btn-block">Speichern</SubmitButton>
            </form>
          </Card>
          <Card title="Rechnungen" flush>
            {invoices.length > 0 && (
              <ul className="list">
                {invoices.map((i) => (
                  <li key={i.id}>
                    <Link href={`/admin/rechnungen/${i.id}`}>
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
            )}
            {editable && items.length > 0 && (
              <form action={adminCreateInvoice} className="stack card-body">
                <input type="hidden" name="order_id" value={order.id} />
                <label className="field">
                  <span>Zahlungsfrist (Tage)</span>
                  <input name="due_days" type="number" min={0} max={120} defaultValue={30} />
                </label>
                <SubmitButton
                  className="btn btn-ghost btn-block"
                  confirm="Rechnung aus den aktuellen Positionen erstellen? Die Kundschaft sieht sie sofort."
                >
                  Rechnung erstellen
                </SubmitButton>
              </form>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
