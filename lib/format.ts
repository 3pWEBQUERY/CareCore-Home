// Anzeige: Schweizer Schreibweise (de-CH), Beträge in Rappen gespeichert.
const chf = new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF" });
const dateFmt = new Intl.DateTimeFormat("de-CH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Zurich",
});
const dateTimeFmt = new Intl.DateTimeFormat("de-CH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Zurich",
});

export const money = (cents: number) => chf.format(cents / 100);
export const date = (value: Date | string | null) => (value ? dateFmt.format(new Date(value)) : "–");
export const dateTime = (value: Date | string | null) => (value ? dateTimeFmt.format(new Date(value)) : "–");

export const ticketNo = (n: number) => `T-${String(n).padStart(5, "0")}`;
export const orderNo = (n: number) => `B-${n}`;
export const invoiceNo = (n: number, issued: Date | string) =>
  `RE-${new Date(issued).getFullYear()}-${String(n).padStart(5, "0")}`;

export function bytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function parseMoney(value: FormDataEntryValue | null) {
  const text = String(value ?? "")
    .trim()
    .replace(/[’' ]/g, "")
    .replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  return Math.round(Number(text) * 100);
}

export function lineTotals(
  items: { quantity: number | string; unit_price_cents: number; vat_rate: number | string }[],
) {
  let subtotal = 0;
  let vat = 0;
  for (const item of items) {
    const net = Math.round(Number(item.quantity) * item.unit_price_cents);
    subtotal += net;
    vat += Math.round((net * Number(item.vat_rate)) / 100);
  }
  return { subtotal, vat, total: subtotal + vat };
}
