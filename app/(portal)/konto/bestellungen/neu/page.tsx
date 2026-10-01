import type { Metadata } from "next";
import { placeOrder } from "@/app/actions/orders";
import SubmitButton from "@/app/components/submit-button";
import { Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Neue Bestellung" };

type Product = { id: string; name: string; description: string; unit: string; price_cents: number; vat_rate: string };

export default async function NewOrderPage({ searchParams }: PageProps<"/konto/bestellungen/neu">) {
  await requireUser("/konto/bestellungen/neu");
  const products = await query<Product>(
    "select id, name, description, unit, price_cents, vat_rate from products where active order by sort, name",
  );
  return (
    <>
      <PageHeader
        back={{ href: "/konto/bestellungen", label: "Bestellungen" }}
        title="Neue Bestellung"
        lead="Wählen Sie Leistungen und Mengen. Wir prüfen die Bestellung und bestätigen sie – erst dann wird sie verbindlich."
      />
      <Flash params={await searchParams} />
      {products.length ? (
        <form action={placeOrder} className="stack-lg">
          <Card flush>
            <table className="table">
              <thead>
                <tr>
                  <th>Leistung</th>
                  <th className="num">Preis (exkl. MWST)</th>
                  <th className="num">Menge</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <b>{p.name}</b>
                      {p.description && <small className="block muted-text">{p.description}</small>}
                    </td>
                    <td className="num nowrap">
                      {money(p.price_cents)} <small className="muted-text">/ {p.unit}</small>
                      <small className="block muted-text">
                        zzgl. {Number(p.vat_rate).toLocaleString("de-CH")} % MWST
                      </small>
                    </td>
                    <td className="num">
                      <input
                        className="qty"
                        type="number"
                        name={`qty_${p.id}`}
                        min={0}
                        step="1"
                        defaultValue={0}
                        aria-label={`Menge ${p.name}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card title="Bemerkung">
            <label className="field">
              <span className="sr-only">Bemerkung</span>
              <textarea
                name="note"
                rows={4}
                placeholder="z. B. gewünschter Starttermin, Anzahl Wohnbereiche, Rechnungsempfänger"
              />
            </label>
          </Card>
          <div className="form-actions">
            <SubmitButton pendingText="Wird gesendet …">Bestellung absenden</SubmitButton>
          </div>
        </form>
      ) : (
        <Card>
          <Empty
            title="Das Angebot wird gerade zusammengestellt"
            text="Für ein individuelles Angebot erstellen Sie bitte ein Ticket in der Kategorie „Abrechnung“."
          />
        </Card>
      )}
    </>
  );
}
