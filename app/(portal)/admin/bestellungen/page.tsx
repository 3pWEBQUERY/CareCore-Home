import Select from "@/app/components/select";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { date, money, orderNo } from "@/lib/format";
import { orderStatus, orderTone } from "@/lib/labels";
import { listOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Bestellungen" };

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/bestellungen">) {
  await requireAdmin();
  const params = await searchParams;
  const status = typeof params.status === "string" && params.status in orderStatus ? params.status : "";
  const q = typeof params.q === "string" ? params.q.slice(0, 80) : "";
  const orders = await listOrders({ status: status || undefined, q: q || undefined });
  return (
    <>
      <PageHeader
        eyebrow="Vertrieb"
        title="Bestellungen"
        actions={
          <Link href="/admin/bestellungen/neu" className="btn btn-primary">
            Bestellung anlegen
          </Link>
        }
      />
      <Flash params={params} />
      <form className="filters" role="search">
        <input name="q" defaultValue={q} placeholder="Suche: Kunde, Nummer" aria-label="Suche" />
        <Select name="status" defaultValue={status} aria-label="Status">
          <option value="">Jeder Status</option>
          {Object.entries(orderStatus).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Select>
        <button className="btn btn-ghost btn-sm">Filtern</button>
      </form>
      <Card flush>
        {orders.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Bestellung</th>
                <th>Kunde</th>
                <th>Datum</th>
                <th className="num">Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/bestellungen/${o.id}`} className="table-link">
                      <b>{orderNo(o.number)}</b>
                      <small>{o.item_count} Positionen</small>
                    </Link>
                  </td>
                  <td>
                    <b className="block">{o.organisation || "–"}</b>
                    <small className="muted-text">{o.customer_name}</small>
                  </td>
                  <td>{date(o.created_at)}</td>
                  <td className="num">{money(o.total_cents)}</td>
                  <td>
                    <Badge tone={orderTone[o.status]}>{orderStatus[o.status as keyof typeof orderStatus]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Keine Bestellungen" />
        )}
      </Card>
    </>
  );
}
