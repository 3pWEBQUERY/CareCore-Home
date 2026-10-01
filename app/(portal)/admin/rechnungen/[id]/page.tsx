import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminSetInvoiceStatus } from "@/app/actions/orders";
import InvoiceDocument from "@/app/components/invoice-document";
import PrintButton from "@/app/components/print-button";
import SubmitButton from "@/app/components/submit-button";
import { Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { invoiceNo } from "@/lib/format";
import { getInvoice } from "@/lib/orders";

export const metadata: Metadata = { title: "Rechnung" };

export default async function AdminInvoicePage({ params, searchParams }: PageProps<"/admin/rechnungen/[id]">) {
  await requireAdmin();
  const invoice = await getInvoice((await params).id);
  if (!invoice) notFound();
  return (
    <>
      <div className="no-print">
        <PageHeader
          back={{ href: "/admin/rechnungen", label: "Rechnungen" }}
          title={`Rechnung ${invoiceNo(invoice.number, invoice.issued_on)}`}
          lead={
            <>
              <Link href={`/admin/kunden/${invoice.customer_id}`}>{invoice.organisation || invoice.customer_name}</Link>{" "}
              · <Link href={`/admin/bestellungen/${invoice.order_id}`}>zur Bestellung</Link>
            </>
          }
          actions={
            <>
              <form action={adminSetInvoiceStatus} className="inline-form">
                <input type="hidden" name="invoice_id" value={invoice.id} />
                {invoice.status === "offen" && (
                  <>
                    <input
                      type="date"
                      name="paid_on"
                      aria-label="Bezahlt am"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                    <SubmitButton name="status" value="bezahlt">
                      Als bezahlt markieren
                    </SubmitButton>
                    <SubmitButton
                      className="btn btn-ghost"
                      name="status"
                      value="storniert"
                      confirm="Rechnung stornieren?"
                    >
                      Stornieren
                    </SubmitButton>
                  </>
                )}
                {invoice.status !== "offen" && (
                  <SubmitButton
                    className="btn btn-ghost"
                    name="status"
                    value="offen"
                    confirm="Rechnung wieder auf „offen“ setzen?"
                  >
                    Wieder öffnen
                  </SubmitButton>
                )}
              </form>
              <PrintButton />
            </>
          }
        />
        <Flash params={await searchParams} />
      </div>
      <InvoiceDocument invoice={invoice} />
    </>
  );
}
