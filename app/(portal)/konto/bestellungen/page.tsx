import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "@phosphor-icons/react/dist/ssr";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { date, money, orderNo } from "@/lib/format";
import { orderStatus, orderTone } from "@/lib/labels";
import { listOrders } from "@/lib/orders";

export const metadata: Metadata = { title: "Bestellungen" };

export default async function OrdersPage({ searchParams }: PageProps<"/konto/bestellungen">) {
  const user = await requireUser();
  const orders = await listOrders({ customerId: user.id });
  return (
    <>
      <PageHeader
        eyebrow="Bestellungen"
        title="Ihre Bestellungen"
        lead="Lizenzen, Einführung, Schulungen und Dienstleistungen – mit Status und zugehörigen Rechnungen."
        actions={
          <Link href="/konto/bestellungen/neu" className="btn btn-primary">
            <Package size={18} /> Neue Bestellung
          </Link>
        }
      />
      <Flash params={await searchParams} />
      <Card flush>
        {orders.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Bestellung</th>
                <th>Datum</th>
                <th>Positionen</th>
                <th className="num">Total inkl. MWST</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/konto/bestellungen/${o.id}`} className="table-link">
                      <b>{orderNo(o.number)}</b>
                    </Link>
                  </td>
                  <td>{date(o.created_at)}</td>
                  <td>{o.item_count}</td>
                  <td className="num">{money(o.total_cents)}</td>
                  <td>
                    <Badge tone={orderTone[o.status]}>{orderStatus[o.status as keyof typeof orderStatus]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Noch keine Bestellungen" text="Über „Neue Bestellung“ wählen Sie aus unserem Angebot." />
        )}
      </Card>
    </>
  );
}
