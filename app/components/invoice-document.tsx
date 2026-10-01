import { site } from "@/lib/site";
import { date, invoiceNo, money, orderNo } from "@/lib/format";

export type InvoiceData = {
  number: number;
  status: string;
  issued_on: Date;
  due_on: Date;
  paid_on: Date | null;
  order_number: number;
  billing: { name: string; organisation: string; street: string; zip_city: string; country: string; email: string };
  items: { description: string; quantity: number; unit: string; unit_price_cents: number; vat_rate: number }[];
  subtotal_cents: number;
  vat_cents: number;
  total_cents: number;
};

export default function InvoiceDocument({ invoice }: { invoice: InvoiceData }) {
  const { company } = site;
  const rates = new Map<number, { net: number; vat: number }>();
  for (const item of invoice.items) {
    const net = Math.round(item.quantity * item.unit_price_cents);
    const entry = rates.get(item.vat_rate) ?? { net: 0, vat: 0 };
    entry.net += net;
    entry.vat += Math.round((net * item.vat_rate) / 100);
    rates.set(item.vat_rate, entry);
  }
  const number = invoiceNo(invoice.number, invoice.issued_on);
  return (
    <article className="invoice">
      {invoice.status === "storniert" && <div className="invoice-stamp">Storniert</div>}
      {invoice.status === "bezahlt" && <div className="invoice-stamp is-paid">Bezahlt {date(invoice.paid_on)}</div>}
      <header className="invoice-head">
        <div className="invoice-brand">
          {/* eslint-disable-next-line @next/next/no-img-element -- Druckansicht */}
          <img src="/carecore-logo.png" alt="" width={40} height={37} />
          <div>
            <b>CareCore</b>
            <span>{company.name}</span>
          </div>
        </div>
        <address>
          {company.name}
          <br />
          {company.street}
          <br />
          {company.city}, {company.country}
          <br />
          {company.email} · {company.phone}
          <br />
          MWST-Nr. {company.vatNo}
        </address>
      </header>

      <section className="invoice-parties">
        <address>
          {invoice.billing.organisation && (
            <>
              <b>{invoice.billing.organisation}</b>
              <br />
            </>
          )}
          {invoice.billing.name}
          <br />
          {invoice.billing.street || "–"}
          <br />
          {invoice.billing.zip_city || "–"}
          <br />
          {invoice.billing.country}
        </address>
        <dl>
          <div>
            <dt>Rechnung</dt>
            <dd>{number}</dd>
          </div>
          <div>
            <dt>Datum</dt>
            <dd>{date(invoice.issued_on)}</dd>
          </div>
          <div>
            <dt>Fällig</dt>
            <dd>{date(invoice.due_on)}</dd>
          </div>
          <div>
            <dt>Bestellung</dt>
            <dd>{orderNo(invoice.order_number)}</dd>
          </div>
        </dl>
      </section>

      <h1 className="invoice-title">Rechnung {number}</h1>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Beschreibung</th>
            <th className="num">Menge</th>
            <th className="num">Preis</th>
            <th className="num">MWST</th>
            <th className="num">Betrag</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{item.description}</td>
              <td className="num">
                {item.quantity.toLocaleString("de-CH")} {item.unit}
              </td>
              <td className="num">{money(item.unit_price_cents)}</td>
              <td className="num">{item.vat_rate.toLocaleString("de-CH")} %</td>
              <td className="num">{money(Math.round(item.quantity * item.unit_price_cents))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}>Zwischensumme (exkl. MWST)</td>
            <td className="num">{money(invoice.subtotal_cents)}</td>
          </tr>
          {[...rates.entries()].map(([rate, sums]) => (
            <tr key={rate}>
              <td colSpan={4}>
                MWST {rate.toLocaleString("de-CH")} % auf {money(sums.net)}
              </td>
              <td className="num">{money(sums.vat)}</td>
            </tr>
          ))}
          <tr className="invoice-total">
            <td colSpan={4}>Total</td>
            <td className="num">{money(invoice.total_cents)}</td>
          </tr>
        </tfoot>
      </table>

      <section className="invoice-pay">
        <p>
          Zahlbar bis <b>{date(invoice.due_on)}</b> auf folgendes Konto:
        </p>
        <dl>
          <div>
            <dt>Kontoinhaber</dt>
            <dd>
              {company.name}, {company.city}
            </dd>
          </div>
          <div>
            <dt>Bank</dt>
            <dd>{company.bank}</dd>
          </div>
          <div>
            <dt>IBAN</dt>
            <dd className="mono">{company.iban}</dd>
          </div>
          <div>
            <dt>Zahlungszweck</dt>
            <dd>{number}</dd>
          </div>
        </dl>
      </section>
      <footer className="invoice-foot">Vielen Dank für Ihr Vertrauen in CareCore.</footer>
    </article>
  );
}
