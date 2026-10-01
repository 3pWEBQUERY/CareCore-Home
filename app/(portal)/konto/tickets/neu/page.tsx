import type { Metadata } from "next";
import { createTicket } from "@/app/actions/tickets";
import FileInput from "@/app/components/file-input";
import SubmitButton from "@/app/components/submit-button";
import { Card, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { orderNo } from "@/lib/format";
import { ticketCategory, ticketPriority } from "@/lib/labels";

export const metadata: Metadata = { title: "Neues Ticket" };

export default async function NewTicketPage({ searchParams }: PageProps<"/konto/tickets/neu">) {
  const user = await requireUser();
  const params = await searchParams;
  const orders = await query<{ id: string; number: number }>(
    "select id, number from orders where customer_id = $1 order by created_at desc limit 50",
    [user.id],
  );
  return (
    <>
      <PageHeader
        back={{ href: "/konto/tickets", label: "Tickets" }}
        title="Neues Ticket"
        lead="Beschreiben Sie Ihr Anliegen möglichst genau – so können wir schneller helfen."
      />
      <Flash params={params} />
      <Card>
        <form action={createTicket} className="stack form-narrow">
          <label className="field">
            <span>Betreff</span>
            <input
              name="subject"
              required
              maxLength={160}
              placeholder="z. B. Medikamentenrunde zeigt Reserve nicht an"
            />
          </label>
          <div className="field-grid">
            <label className="field">
              <span>Kategorie</span>
              <select name="category" defaultValue="frage">
                {Object.entries(ticketCategory).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Dringlichkeit</span>
              <select name="priority" defaultValue="normal">
                {Object.entries(ticketPriority).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {orders.length > 0 && (
            <label className="field">
              <span>Bezug zu einer Bestellung (optional)</span>
              <select name="order_id" defaultValue="">
                <option value="">Kein Bezug</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Bestellung {orderNo(o.number)}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="field">
            <span>Beschreibung</span>
            <textarea
              name="body"
              rows={8}
              required
              placeholder="Was ist passiert? Auf welchem Gerät und in welchem Modul? Was haben Sie erwartet?"
            />
          </label>
          <p className="field-hint">
            Bitte keine Gesundheitsdaten von Bewohnerinnen und Bewohnern in Tickets schreiben – verwenden Sie Initialen
            oder Zimmernummern.
          </p>
          <FileInput />
          <div className="form-actions">
            <SubmitButton pendingText="Wird gesendet …">Ticket senden</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
