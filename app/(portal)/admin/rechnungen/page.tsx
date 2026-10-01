import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { date, invoiceNo, money, orderNo } from "@/lib/format";
import { invoiceStatus, invoiceTone } from "@/lib/labels";
import { listInvoices } from "@/lib/orders";

export const metadata: Metadata = { title: "Rechnungen" };

export default async function AdminInvoicesPage({ searchParams }: PageProps<"/admin/rechnungen">) {
  await requireAdmin();
  const params = await searchParams;
  const status = typeof params.status === "string" && params.status in invoiceStatus ? params.status : "";
  const invoices = await listInvoices({ status: status || undefined });
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader eyebrow="Abrechnung" title="Rechnungen" lead="Rechnungen entstehen aus Bestellungen." />
      <Flash params={params} />
      <nav className="tabs" aria-label="Filter">
        {[["", "Alle"], ...Object.entries(invoiceStatus)].map(([v, l]) => (
          <Link
            key={v}
            href={v ? `/admin/rechnungen?status=${v}` : "/admin/rechnungen"}
            className={status === v ? "is-active" : undefined}
          >
            {l}
          </Link>
        ))}
      </nav>
      <Card flush>
        {invoices.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Rechnung</th>
                <th>Kunde</th>
                <th>Bestellung</th>
                <th>Fällig</th>
                <th className="num">Betrag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => {
                const overdue = i.status === "offen" && new Date(i.due_on).toISOString().slice(0, 10) < today;
                return (
                  <tr key={i.id}>
                    <td>
                      <Link href={`/admin/rechnungen/${i.id}`} className="table-link">
                        <b>{invoiceNo(i.number, i.issued_on)}</b>
                        <small>{date(i.issued_on)}</small>
                      </Link>
                    </td>
                    <td>{i.organisation || i.customer_name}</td>
                    <td>
                      <Link href={`/admin/bestellungen/${i.order_id}`}>{orderNo(i.order_number)}</Link>
                    </td>
                    <td className={overdue ? "text-critical" : undefined}>
                      {date(i.due_on)}
                      {overdue && " · überfällig"}
                    </td>
                    <td className="num">{money(i.total_cents)}</td>
                    <td>
                      <Badge tone={invoiceTone[i.status]}>
                        {invoiceStatus[i.status as keyof typeof invoiceStatus]}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Empty title="Keine Rechnungen" />
        )}
      </Card>
    </>
  );
}
