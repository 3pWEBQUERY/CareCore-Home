"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { requireAdmin, requireUser } from "@/lib/auth";
import { query, queryOne, transaction } from "@/lib/db";
import { invoiceNo, lineTotals, orderNo, parseMoney } from "@/lib/format";
import { orderStatus, pick, units } from "@/lib/labels";
import { adminEmails, appUrl, sendMail } from "@/lib/mail";

const uuid = (value: FormDataEntryValue | null) => {
  const id = String(value ?? "");
  return /^[0-9a-f-]{36}$/.test(id) ? id : null;
};
const text = (data: FormData, key: string, max = 2000) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);

type Product = { id: string; name: string; unit: string; price_cents: number; vat_rate: string };

// ---------- Kundschaft ----------

export async function placeOrder(data: FormData) {
  const user = await requireUser("/konto/bestellungen/neu");
  const products = await query<Product>("select id, name, unit, price_cents, vat_rate from products where active");
  const lines = products
    .map((product) => ({ product, quantity: Number(String(data.get(`qty_${product.id}`) ?? "0").replace(",", ".")) }))
    .filter((line) => Number.isFinite(line.quantity) && line.quantity > 0 && line.quantity <= 10000);
  if (!lines.length) redirect("/konto/bestellungen/neu?fehler=leer");
  const note = text(data, "note");

  const order = await transaction(async (client) => {
    const row = (
      await client.query<{ id: string; number: number }>(
        "insert into orders (customer_id, customer_note) values ($1, $2) returning id, number",
        [user.id, note],
      )
    ).rows[0];
    let position = 0;
    for (const { product, quantity } of lines)
      await client.query(
        `insert into order_items (order_id, product_id, description, quantity, unit, unit_price_cents, vat_rate, position)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          row.id,
          product.id,
          product.name,
          Math.round(quantity * 100) / 100,
          product.unit,
          product.price_cents,
          product.vat_rate,
          position++,
        ],
      );
    await audit(user.id, "bestellt", "bestellung", row.id, orderNo(row.number), client);
    return row;
  });

  await sendMail(
    await adminEmails(),
    `Neue Bestellung ${orderNo(order.number)} von ${user.organisation || user.name}`,
    `${lines.map((l) => `${l.quantity} × ${l.product.name}`).join("\n")}\n\n${note}\n\n${appUrl(`/admin/bestellungen/${order.id}`)}`,
  );
  redirect(`/konto/bestellungen/${order.id}?ok=bestellung`);
}

export async function cancelOwnOrder(data: FormData) {
  const user = await requireUser();
  const id = uuid(data.get("order_id"));
  const updated = await queryOne<{ id: string }>(
    `update orders set status = 'storniert', updated_at = now()
     where id = $1 and customer_id = $2 and status = 'angefragt' returning id`,
    [id, user.id],
  );
  if (!updated) redirect(`/konto/bestellungen/${id}?fehler=status`);
  await audit(user.id, "storniert", "bestellung", updated.id, "durch Kundschaft");
  redirect(`/konto/bestellungen/${id}?ok=gespeichert`);
}

// ---------- Administration ----------

export async function adminCreateOrder(data: FormData) {
  const admin = await requireAdmin();
  const customerId = uuid(data.get("customer_id"));
  const customer = customerId
    ? await queryOne<{ id: string }>("select id from app_users where id = $1", [customerId])
    : null;
  if (!customer) redirect("/admin/bestellungen/neu?fehler=pflicht");
  const order = await queryOne<{ id: string; number: number }>(
    "insert into orders (customer_id, status, internal_note) values ($1, 'bestaetigt', $2) returning id, number",
    [customer.id, text(data, "internal_note")],
  );
  await audit(admin.id, "angelegt", "bestellung", order!.id, orderNo(order!.number));
  redirect(`/admin/bestellungen/${order!.id}?ok=angelegt`);
}

async function editableOrder(id: string | null) {
  const order = id
    ? await queryOne<{ id: string; status: string }>("select id, status from orders where id = $1", [id])
    : null;
  if (!order) redirect("/admin/bestellungen");
  return order;
}

export async function adminAddItem(data: FormData) {
  const admin = await requireAdmin();
  const order = await editableOrder(uuid(data.get("order_id")));
  const path = `/admin/bestellungen/${order.id}`;
  const productId = uuid(data.get("product_id"));
  const product = productId
    ? await queryOne<Product>("select id, name, unit, price_cents, vat_rate from products where id = $1", [productId])
    : null;
  const quantity = Number(text(data, "quantity").replace(",", "."));
  const description = text(data, "description", 300) || product?.name || "";
  const priceInput = text(data, "price");
  const price = priceInput ? parseMoney(priceInput) : (product?.price_cents ?? null);
  const unit = (units as readonly string[]).includes(text(data, "unit"))
    ? text(data, "unit")
    : (product?.unit ?? "einmalig");
  const vat = Number(text(data, "vat_rate").replace(",", ".") || product?.vat_rate || 8.1);
  if (!description || !(quantity > 0) || !Number.isFinite(vat) || vat < 0 || vat > 30)
    redirect(`${path}?fehler=pflicht`);
  if (price === null) redirect(`${path}?fehler=betrag`);
  await query(
    `insert into order_items (order_id, product_id, description, quantity, unit, unit_price_cents, vat_rate, position)
     values ($1, $2, $3, $4, $5, $6, $7, (select coalesce(max(position), 0) + 1 from order_items where order_id = $1))`,
    [order.id, product?.id ?? null, description, Math.round(quantity * 100) / 100, unit, price, vat],
  );
  await query("update orders set updated_at = now() where id = $1", [order.id]);
  await audit(admin.id, "position_hinzugefuegt", "bestellung", order.id, `${quantity} × ${description}`);
  redirect(`${path}?ok=gespeichert`);
}

export async function adminRemoveItem(data: FormData) {
  const admin = await requireAdmin();
  const order = await editableOrder(uuid(data.get("order_id")));
  const item = await queryOne<{ description: string }>(
    "delete from order_items where id = $1 and order_id = $2 returning description",
    [uuid(data.get("item_id")), order.id],
  );
  if (item) await audit(admin.id, "position_entfernt", "bestellung", order.id, item.description);
  redirect(`/admin/bestellungen/${order.id}?ok=geloescht`);
}

export async function adminUpdateOrder(data: FormData) {
  const admin = await requireAdmin();
  const order = await editableOrder(uuid(data.get("order_id")));
  const status = pick(orderStatus, data.get("status")) ?? order.status;
  await query("update orders set status = $2, internal_note = $3, updated_at = now() where id = $1", [
    order.id,
    status,
    text(data, "internal_note"),
  ]);
  if (status !== order.status) {
    await audit(admin.id, "status", "bestellung", order.id, orderStatus[status as keyof typeof orderStatus]);
    const info = await queryOne<{ email: string; name: string; number: number }>(
      "select u.email, u.name, o.number from orders o join app_users u on u.id = o.customer_id where o.id = $1",
      [order.id],
    );
    if (info)
      await sendMail(
        info.email,
        `Bestellung ${orderNo(info.number)}: ${orderStatus[status as keyof typeof orderStatus]}`,
        `Guten Tag ${info.name}\n\nDer Status Ihrer Bestellung ${orderNo(info.number)} lautet jetzt: ${
          orderStatus[status as keyof typeof orderStatus]
        }.\n\n${appUrl(`/konto/bestellungen/${order.id}`)}\n\nFreundliche Grüsse\nCareCore`,
      );
  }
  redirect(`/admin/bestellungen/${order.id}?ok=gespeichert`);
}

export async function adminCreateInvoice(data: FormData) {
  const admin = await requireAdmin();
  const order = await editableOrder(uuid(data.get("order_id")));
  const path = `/admin/bestellungen/${order.id}`;
  if (order.status === "storniert") redirect(`${path}?fehler=status`);
  const items = await query<{
    description: string;
    quantity: string;
    unit: string;
    unit_price_cents: number;
    vat_rate: string;
  }>(
    "select description, quantity, unit, unit_price_cents, vat_rate from order_items where order_id = $1 order by position",
    [order.id],
  );
  if (!items.length) redirect(`${path}?fehler=leer`);
  const dueDays = Math.min(Math.max(Number(text(data, "due_days")) || 30, 0), 120);
  const totals = lineTotals(items);

  const invoice = await transaction(async (client) => {
    const customer = (
      await client.query(
        `select u.id, u.name, u.organisation, u.street, u.zip_city, u.country, u.email
         from orders o join app_users u on u.id = o.customer_id where o.id = $1`,
        [order.id],
      )
    ).rows[0];
    const row = (
      await client.query<{ id: string; number: number; issued_on: Date }>(
        `insert into invoices (order_id, customer_id, due_on, billing, items, subtotal_cents, vat_cents, total_cents)
         values ($1, $2, current_date + $3::int, $4, $5, $6, $7, $8) returning id, number, issued_on`,
        [
          order.id,
          customer.id,
          dueDays,
          JSON.stringify({
            name: customer.name,
            organisation: customer.organisation,
            street: customer.street,
            zip_city: customer.zip_city,
            country: customer.country,
            email: customer.email,
          }),
          JSON.stringify(items.map((i) => ({ ...i, quantity: Number(i.quantity), vat_rate: Number(i.vat_rate) }))),
          totals.subtotal,
          totals.vat,
          totals.total,
        ],
      )
    ).rows[0];
    await audit(admin.id, "rechnung_erstellt", "rechnung", row.id, invoiceNo(row.number, row.issued_on), client);
    return { ...row, email: customer.email as string, name: customer.name as string };
  });

  await sendMail(
    invoice.email,
    `Neue Rechnung ${invoiceNo(invoice.number, invoice.issued_on)}`,
    `Guten Tag ${invoice.name}\n\nIn Ihrem Kundenkonto steht eine neue Rechnung bereit:\n${appUrl(
      `/konto/rechnungen/${invoice.id}`,
    )}\n\nFreundliche Grüsse\nCareCore`,
  );
  redirect(`/admin/rechnungen/${invoice.id}?ok=rechnung`);
}

export async function adminSetInvoiceStatus(data: FormData) {
  const admin = await requireAdmin();
  const id = uuid(data.get("invoice_id"));
  const status = String(data.get("status"));
  if (!id || !["offen", "bezahlt", "storniert"].includes(status)) redirect("/admin/rechnungen");
  const row = await queryOne<{ number: number; issued_on: Date }>(
    `update invoices set status = $2, paid_on = case when $2 = 'bezahlt' then coalesce($3::date, current_date) else null end
     where id = $1 returning number, issued_on`,
    [id, status, text(data, "paid_on") || null],
  );
  if (row) await audit(admin.id, `rechnung_${status}`, "rechnung", id, invoiceNo(row.number, row.issued_on));
  redirect(`/admin/rechnungen/${id}?ok=gespeichert`);
}
