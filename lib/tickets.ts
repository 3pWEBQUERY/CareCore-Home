import "server-only";
import { query } from "./db";

export type TicketRow = {
  id: string;
  number: number;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  customer_id: string;
  customer_name: string;
  organisation: string;
  customer_email: string;
  assignee_id: string | null;
  assignee_name: string | null;
  order_id: string | null;
  order_number: number | null;
  message_count: number;
  last_author_role: string | null;
};

export type MessageRow = {
  id: string;
  body: string;
  internal: boolean;
  created_at: Date;
  author_id: string | null;
  author_name: string | null;
  author_role: string | null;
};

export type AttachmentRow = { id: string; message_id: string; file_name: string; size_bytes: number };
export type EventRow = { id: number; kind: string; detail: string; created_at: Date; actor_name: string | null };

const base = `
  select t.*, c.name as customer_name, c.organisation, c.email as customer_email,
    a.name as assignee_name, o.number as order_number,
    (select count(*)::int from ticket_messages m where m.ticket_id = t.id and not m.internal) as message_count,
    (select u.role from ticket_messages m left join app_users u on u.id = m.author_id
      where m.ticket_id = t.id and not m.internal order by m.created_at desc limit 1) as last_author_role
  from tickets t
  join app_users c on c.id = t.customer_id
  left join app_users a on a.id = t.assignee_id
  left join orders o on o.id = t.order_id`;

export async function listTickets(filter: {
  customerId?: string;
  status?: string;
  open?: boolean;
  priority?: string;
  assignee?: string;
  q?: string;
  limit?: number;
}) {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    params.push(value);
    where.push(sql.replace("?", `$${params.length}`));
  };
  if (filter.customerId) add("t.customer_id = ?", filter.customerId);
  if (filter.status) add("t.status = ?", filter.status);
  if (filter.open === true) where.push("t.status not in ('geloest', 'geschlossen')");
  if (filter.open === false) where.push("t.status in ('geloest', 'geschlossen')");
  if (filter.priority) add("t.priority = ?", filter.priority);
  if (filter.assignee === "none") where.push("t.assignee_id is null");
  else if (filter.assignee) add("t.assignee_id = ?", filter.assignee);
  if (filter.q) {
    params.push(`%${filter.q}%`);
    const p = `$${params.length}`;
    const num = Number(filter.q.replace(/\D/g, ""));
    where.push(
      `(t.subject ilike ${p} or c.name ilike ${p} or c.organisation ilike ${p} or c.email ilike ${p}${
        num ? ` or t.number = ${num}` : ""
      })`,
    );
  }
  return query<TicketRow>(
    `${base} ${where.length ? `where ${where.join(" and ")}` : ""}
     order by case t.priority when 'dringend' then 0 when 'hoch' then 1 else 2 end,
       case when t.status in ('geloest', 'geschlossen') then 1 else 0 end, t.updated_at desc
     limit ${filter.limit ?? 200}`,
    params,
  );
}

export async function getTicket(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return (await query<TicketRow>(`${base} where t.id = $1`, [id]))[0] ?? null;
}

export async function ticketThread(ticketId: string, includeInternal: boolean) {
  const messages = await query<MessageRow>(
    `select m.id, m.body, m.internal, m.created_at, m.author_id, u.name as author_name, u.role as author_role
     from ticket_messages m left join app_users u on u.id = m.author_id
     where m.ticket_id = $1 ${includeInternal ? "" : "and not m.internal"} order by m.created_at`,
    [ticketId],
  );
  const attachments = await query<AttachmentRow>(
    `select a.id, a.message_id, a.file_name, a.size_bytes from ticket_attachments a
     join ticket_messages m on m.id = a.message_id
     where a.ticket_id = $1 ${includeInternal ? "" : "and not m.internal"} order by a.created_at`,
    [ticketId],
  );
  return { messages, attachments };
}

export async function ticketEvents(ticketId: string) {
  return query<EventRow>(
    `select e.id, e.kind, e.detail, e.created_at, u.name as actor_name
     from ticket_events e left join app_users u on u.id = e.actor_id where e.ticket_id = $1 order by e.created_at`,
    [ticketId],
  );
}
