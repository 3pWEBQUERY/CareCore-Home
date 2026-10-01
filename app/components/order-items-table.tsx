import { lineTotals, money } from "@/lib/format";
import type { ItemRow } from "@/lib/orders";

export default function OrderItemsTable({
  items,
  action,
}: {
  items: ItemRow[];
  action?: (item: ItemRow) => React.ReactNode;
}) {
  const totals = lineTotals(items);
  if (!items.length) return <p className="card-note">Noch keine Positionen.</p>;
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Beschreibung</th>
          <th className="num">Menge</th>
          <th className="num">Preis</th>
          <th className="num">MWST</th>
          <th className="num">Betrag</th>
          {action && <th />}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.description}</td>
            <td className="num nowrap">
              {Number(item.quantity).toLocaleString("de-CH")} {item.unit}
            </td>
            <td className="num">{money(item.unit_price_cents)}</td>
            <td className="num">{Number(item.vat_rate).toLocaleString("de-CH")} %</td>
            <td className="num">{money(Math.round(Number(item.quantity) * item.unit_price_cents))}</td>
            {action && <td className="num">{action(item)}</td>}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4}>Zwischensumme</td>
          <td className="num">{money(totals.subtotal)}</td>
          {action && <td />}
        </tr>
        <tr>
          <td colSpan={4}>MWST</td>
          <td className="num">{money(totals.vat)}</td>
          {action && <td />}
        </tr>
        <tr className="total-row">
          <td colSpan={4}>Total</td>
          <td className="num">{money(totals.total)}</td>
          {action && <td />}
        </tr>
      </tfoot>
    </table>
  );
}
