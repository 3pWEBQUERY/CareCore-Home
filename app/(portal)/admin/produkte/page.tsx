import Select from "@/app/components/select";
import type { Metadata } from "next";
import { adminSaveProduct } from "@/app/actions/account";
import SubmitButton from "@/app/components/submit-button";
import { Badge, Card, Empty, Flash, PageHeader } from "@/app/components/ui";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { money } from "@/lib/format";
import { units } from "@/lib/labels";

export const metadata: Metadata = { title: "Produkte & Preise" };

type Product = {
  id: string;
  name: string;
  description: string;
  unit: string;
  price_cents: number;
  vat_rate: string;
  active: boolean;
  sort: number;
};

function ProductFields({ p }: { p?: Product }) {
  return (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="field-grid">
        <label className="field">
          <span>Name</span>
          <input name="name" required defaultValue={p?.name} />
        </label>
        <label className="field">
          <span>Einheit</span>
          <Select name="unit" defaultValue={p?.unit ?? "Monat"}>
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </Select>
        </label>
      </div>
      <label className="field">
        <span>Beschreibung</span>
        <textarea name="description" rows={2} defaultValue={p?.description} />
      </label>
      <div className="field-grid field-grid-3">
        <label className="field">
          <span>Preis CHF (exkl. MWST)</span>
          <input name="price" required inputMode="decimal" defaultValue={p ? (p.price_cents / 100).toFixed(2) : ""} />
        </label>
        <label className="field">
          <span>MWST %</span>
          <input name="vat_rate" inputMode="decimal" defaultValue={p ? Number(p.vat_rate) : 8.1} />
        </label>
        <label className="field">
          <span>Reihenfolge</span>
          <input name="sort" type="number" defaultValue={p?.sort ?? 0} />
        </label>
      </div>
      <label className="check">
        <input type="checkbox" name="active" defaultChecked={p?.active ?? true} />
        <span>Im Kundenportal bestellbar</span>
      </label>
    </>
  );
}

export default async function ProductsPage({ searchParams }: PageProps<"/admin/produkte">) {
  await requireAdmin();
  const products = await query<Product>("select * from products order by active desc, sort, name");
  return (
    <>
      <PageHeader
        eyebrow="Angebot"
        title="Produkte & Preise"
        lead="Was die Kundschaft im Portal bestellen kann. Preisänderungen gelten nur für neue Bestellungen."
      />
      <Flash params={await searchParams} />
      <div className="detail-layout">
        <div className="stack">
          {products.length ? (
            products.map((p) => (
              <details key={p.id} className="card product">
                <summary>
                  <span>
                    <b>{p.name}</b>
                    <small>
                      {money(p.price_cents)} / {p.unit} · {Number(p.vat_rate)} % MWST
                    </small>
                  </span>
                  {p.active ? <Badge tone="success">Aktiv</Badge> : <Badge>Inaktiv</Badge>}
                </summary>
                <form action={adminSaveProduct} className="stack card-body">
                  <ProductFields p={p} />
                  <div className="form-actions">
                    <SubmitButton>Speichern</SubmitButton>
                  </div>
                </form>
              </details>
            ))
          ) : (
            <Card>
              <Empty
                title="Noch keine Produkte"
                text="Legen Sie rechts Lizenzen, Einführungspakete oder Schulungen an."
              />
            </Card>
          )}
        </div>
        <aside className="detail-side">
          <Card title="Neues Produkt">
            <form action={adminSaveProduct} className="stack">
              <ProductFields />
              <SubmitButton className="btn btn-primary btn-block">Anlegen</SubmitButton>
            </form>
          </Card>
        </aside>
      </div>
    </>
  );
}
