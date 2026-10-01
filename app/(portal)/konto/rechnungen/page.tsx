import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { date, invoiceNo, money, orderNo } from "@/lib/format";
import { invoiceStatus, invoiceTone } from "@/lib/labels";
import { listInvoices } from "@/lib/orders";

export const metadata: Metadata = { title: "Rechnungen" };

export default async function InvoicesPage() {
  const user = await requireUser();
  const invoices = await listInvoices({ customerId: user.id });
  return (
    <>
      <PageHeader
        eyebrow="Abrechnung"
        title="Rechnungen"
        lead="Alle Rechnungen zum Ansehen, Drucken oder Speichern als PDF."
      />
      <Card flush>
        {invoices.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Rechnung</th>
                <th>Bestellung</th>
                <th>Datum</th>
                <th>Fällig</th>
                <th className="num">Betrag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link href={`/konto/rechnungen/${i.id}`} className="table-link">
                      <b>{invoiceNo(i.number, i.issued_on)}</b>
                    </Link>
                  </td>
                  <td>{orderNo(i.order_number)}</td>
                  <td>{date(i.issued_on)}</td>
                  <td>{date(i.due_on)}</td>
                  <td className="num">{money(i.total_cents)}</td>
                  <td>
                    <Badge tone={invoiceTone[i.status]}>{invoiceStatus[i.status as keyof typeof invoiceStatus]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty title="Noch keine Rechnungen" />
        )}
      </Card>
    </>
  );
}
