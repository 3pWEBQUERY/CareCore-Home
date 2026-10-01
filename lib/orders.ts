import "server-only";
import { query, queryOne } from "./db";
import type { InvoiceData } from "@/app/components/invoice-document";

export type OrderRow = {
  id: string;
  number: number;
  status: string;
  customer_id: string;
  customer_name: string;
  organisation: string;
  customer_email: string;
  customer_note: string;
  internal_note: string;
  created_at: Date;
  updated_at: Date;
  item_count: number;
  total_cents: number;
};

export type ItemRow = {
  id: string;
  description: string;
  quantity: string;
  unit: string;
  unit_price_cents: number;
  vat_rate: string;
};

const base = `
  select o.*, u.name as customer_name, u.organisation, u.email as customer_email,
    (select count(*)::int from order_items i where i.order_id = o.id) as item_count,
    (select coalesce(sum(round(i.quantity * i.unit_price_cents) + round(round(i.quantity * i.unit_price_cents) * i.vat_rate / 100)), 0)::int
       from order_items i where i.order_id = o.id) as total_cents
  from orders o join app_users u on u.id = o.customer_id`;

export async function listOrders(filter: { customerId?: string; status?: string; q?: string }) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filter.customerId) {
    params.push(filter.customerId);
    where.push(`o.customer_id = $${params.length}`);
  }
  if (filter.status) {
    params.push(filter.status);
    where.push(`o.status = $${params.length}`);
  }
  if (filter.q) {
    params.push(`%${filter.q}%`);
    const num = Number(filter.q.replace(/\D/g, ""));
    where.push(
      `(u.name ilike $${params.length} or u.organisation ilike $${params.length}${num ? ` or o.number = ${num}` : ""})`,
    );
  }
  return query<OrderRow>(
    `${base} ${where.length ? `where ${where.join(" and ")}` : ""} order by o.created_at desc limit 300`,
    params,
  );
}

export async function getOrder(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return queryOne<OrderRow>(`${base} where o.id = $1`, [id]);
}

export const orderItems = (orderId: string) =>
  query<ItemRow>(
    "select id, description, quantity, unit, unit_price_cents, vat_rate from order_items where order_id = $1 order by position",
    [orderId],
  );

export type InvoiceRow = InvoiceData & {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  organisation: string;
};

export async function listInvoices(filter: { customerId?: string; orderId?: string; status?: string }) {
  const where: string[] = [];
  const params: unknown[] = [];
  for (const [column, value] of [
    ["i.customer_id", filter.customerId],
    ["i.order_id", filter.orderId],
    ["i.status", filter.status],
  ] as const) {
    if (!value) continue;
    params.push(value);
    where.push(`${column} = $${params.length}`);
  }
  return query<InvoiceRow>(
    `select i.*, o.number as order_number, u.name as customer_name, u.organisation
     from invoices i join orders o on o.id = i.order_id join app_users u on u.id = i.customer_id
     ${where.length ? `where ${where.join(" and ")}` : ""} order by i.issued_on desc, i.number desc limit 300`,
    params,
  );
}

export async function getInvoice(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return queryOne<InvoiceRow>(
    `select i.*, o.number as order_number, u.name as customer_name, u.organisation
     from invoices i join orders o on o.id = i.order_id join app_users u on u.id = i.customer_id where i.id = $1`,
    [id],
  );
}
