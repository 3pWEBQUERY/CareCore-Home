import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvoiceDocument from "@/app/components/invoice-document";
import PrintButton from "@/app/components/print-button";
import { PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { invoiceNo } from "@/lib/format";
import { getInvoice } from "@/lib/orders";

export const metadata: Metadata = { title: "Rechnung" };

export default async function InvoicePage({ params }: PageProps<"/konto/rechnungen/[id]">) {
  const user = await requireUser();
  const invoice = await getInvoice((await params).id);
  if (!invoice || invoice.customer_id !== user.id) notFound();
  return (
    <>
      <div className="no-print">
        <PageHeader
          back={{ href: "/konto/rechnungen", label: "Rechnungen" }}
          title={`Rechnung ${invoiceNo(invoice.number, invoice.issued_on)}`}
          actions={<PrintButton />}
        />
      </div>
      <InvoiceDocument invoice={invoice} />
    </>
  );
}
