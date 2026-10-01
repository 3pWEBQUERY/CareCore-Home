import Select from "@/app/components/select";
import type { Metadata } from "next";
import { adminCreateOrder } from "@/app/actions/orders";
import SubmitButton from "@/app/components/submit-button";
import { Card, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const metadata: Metadata = { title: "Bestellung anlegen" };

export default async function NewAdminOrderPage({ searchParams }: PageProps<"/admin/bestellungen/neu">) {
  await requireAdmin();
  const customers = await query<{ id: string; name: string; organisation: string; email: string }>(
    "select id, name, organisation, email from app_users where role = 'customer' and active order by organisation, name",
  );
  return (
    <>
      <PageHeader
        back={{ href: "/admin/bestellungen", label: "Bestellungen" }}
        title="Bestellung anlegen"
        lead="Zum Beispiel nach einer Demo oder einem Vertragsabschluss. Positionen ergänzen Sie im nächsten Schritt."
      />
      <Flash params={await searchParams} />
      <Card>
        <form action={adminCreateOrder} className="stack form-narrow">
          <label className="field">
            <span>Kunde</span>
            <Select name="customer_id" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.organisation ? `${c.organisation} – ${c.name}` : c.name} ({c.email})
                </option>
              ))}
            </Select>
          </label>
          <label className="field">
            <span>Interne Notiz (optional)</span>
            <textarea name="internal_note" rows={3} />
          </label>
          <div className="form-actions">
            <SubmitButton>Anlegen</SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}
