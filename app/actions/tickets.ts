"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prepareFiles, storeFiles } from "@/lib/attachments";
import { audit } from "@/lib/audit";
import { requireAdmin, requireUser } from "@/lib/auth";
import { queryOne, transaction } from "@/lib/db";
import { ticketNo } from "@/lib/format";
import { pick, ticketCategory, ticketPriority, ticketStatusAdmin } from "@/lib/labels";
import { adminEmails, appUrl, sendMail } from "@/lib/mail";
import { getTicket } from "@/lib/tickets";

const text = (data: FormData, key: string, max = 10000) =>
  String(data.get(key) ?? "")
    .trim()
    .slice(0, max);

// ---------- Kundschaft ----------

export async function createTicket(data: FormData) {
  const user = await requireUser("/konto/tickets/neu");
  const subject = text(data, "subject", 160);
  const body = text(data, "body");
  const category = pick(ticketCategory, data.get("category")) ?? "frage";
  const priority = pick(ticketPriority, data.get("priority")) ?? "normal";
  if (!subject || !body) redirect("/konto/tickets/neu?fehler=pflicht");
  const files = await prepareFiles(data);
  if (!files) redirect("/konto/tickets/neu?fehler=datei");

  let orderId: string | null = String(data.get("order_id") ?? "") || null;
  if (orderId) {
    const own = await queryOne("select 1 from orders where id = $1 and customer_id = $2", [orderId, user.id]).catch(
      () => null,
    );
    if (!own) orderId = null;
  }

  const ticket = await transaction(async (client) => {
    const row = (
      await client.query<{ id: string; number: number }>(
        `insert into tickets (customer_id, subject, category, priority, order_id) values ($1, $2, $3, $4, $5)
         returning id, number`,
        [user.id, subject, category, priority, orderId],
      )
    ).rows[0];
    const message = (
      await client.query<{ id: string }>(
        "insert into ticket_messages (ticket_id, author_id, body) values ($1, $2, $3) returning id",
        [row.id, user.id, body],
      )
    ).rows[0];
    await storeFiles(client, row.id, message.id, files);
    await client.query("insert into ticket_events (ticket_id, actor_id, kind) values ($1, $2, 'erstellt')", [
      row.id,
      user.id,
    ]);
    return row;
  });

  await sendMail(
    await adminEmails(),
    `[${ticketNo(ticket.number)}] Neues Ticket: ${subject}`,
    `${user.name} (${user.organisation || user.email}) hat ein Ticket erstellt.\n\nKategorie: ${ticketCategory[category]}\nPriorität: ${ticketPriority[priority]}\n\n${body}\n\n${appUrl(`/admin/tickets/${ticket.id}`)}`,
  );
  redirect(`/konto/tickets/${ticket.id}?ok=ticket_erstellt`);
}

export async function customerReply(data: FormData) {
  const user = await requireUser();
  const ticket = await getTicket(String(data.get("ticket_id")));
  if (!ticket || ticket.customer_id !== user.id) redirect("/konto/tickets");
  const path = `/konto/tickets/${ticket.id}`;
  if (ticket.status === "geschlossen") redirect(`${path}?fehler=status`);
  const body = text(data, "body");
  if (!body) redirect(`${path}?fehler=pflicht`);
  const files = await prepareFiles(data);
  if (!files) redirect(`${path}?fehler=datei`);

  await transaction(async (client) => {
    const message = (
      await client.query<{ id: string }>(
        "insert into ticket_messages (ticket_id, author_id, body) values ($1, $2, $3) returning id",
        [ticket.id, user.id, body],
      )
    ).rows[0];
    await storeFiles(client, ticket.id, message.id, files);
    const reopen = ["wartet_auf_kunde", "geloest"].includes(ticket.status);
    await client.query(
      `update tickets set updated_at = now(), status = case when $2 then 'offen' else status end where id = $1`,
      [ticket.id, reopen],
    );
    if (reopen)
      await client.query(
        "insert into ticket_events (ticket_id, actor_id, kind, detail) values ($1, $2, 'status', 'Offen (Antwort der Kundschaft)')",
        [ticket.id, user.id],
      );
  });

  const to = ticket.assignee_id
    ? [
        (await queryOne<{ email: string }>("select email from app_users where id = $1", [ticket.assignee_id]))?.email ??
          "",
      ]
    : await adminEmails();
  await sendMail(
    to,
    `[${ticketNo(ticket.number)}] Neue Antwort: ${ticket.subject}`,
    `${user.name} hat geantwortet:\n\n${body}\n\n${appUrl(`/admin/tickets/${ticket.id}`)}`,
  );
  revalidatePath(path);
  redirect(`${path}?ok=antwort#ende`);
}

export async function customerSetOpen(data: FormData) {
  const user = await requireUser();
  const ticket = await getTicket(String(data.get("ticket_id")));
  if (!ticket || ticket.customer_id !== user.id) redirect("/konto/tickets");
  const close = data.get("action") === "close";
  await transaction(async (client) => {
    await client.query(
      `update tickets set status = $2, updated_at = now(), closed_at = case when $2 = 'geschlossen' then now() else null end
       where id = $1`,
      [ticket.id, close ? "geschlossen" : "offen"],
    );
    await client.query("insert into ticket_events (ticket_id, actor_id, kind, detail) values ($1, $2, 'status', $3)", [
      ticket.id,
      user.id,
      close ? "Von der Kundschaft geschlossen" : "Von der Kundschaft wieder geöffnet",
    ]);
  });
  redirect(`/konto/tickets/${ticket.id}?ok=${close ? "ticket_geschlossen" : "ticket_geoeffnet"}`);
}

// ---------- Administration ----------

export async function adminReply(data: FormData) {
  const admin = await requireAdmin();
  const ticket = await getTicket(String(data.get("ticket_id")));
  if (!ticket) redirect("/admin/tickets");
  const path = `/admin/tickets/${ticket.id}`;
  const body = text(data, "body");
  const internal = data.get("internal") === "on";
  const nextStatus = pick(ticketStatusAdmin, data.get("next_status"));
  if (!body) redirect(`${path}?fehler=pflicht`);
  const files = await prepareFiles(data);
  if (!files) redirect(`${path}?fehler=datei`);

  await transaction(async (client) => {
    const message = (
      await client.query<{ id: string }>(
        "insert into ticket_messages (ticket_id, author_id, body, internal) values ($1, $2, $3, $4) returning id",
        [ticket.id, admin.id, body, internal],
      )
    ).rows[0];
    await storeFiles(client, ticket.id, message.id, files);
    const status = nextStatus && nextStatus !== ticket.status ? nextStatus : ticket.status;
    await client.query(
      `update tickets set updated_at = now(), status = $2,
         assignee_id = coalesce(assignee_id, $3),
         closed_at = case when $2 = 'geschlossen' then coalesce(closed_at, now()) when $2 <> 'geschlossen' then null end
       where id = $1`,
      [ticket.id, status, admin.id],
    );
    if (status !== ticket.status)
      await client.query(
        "insert into ticket_events (ticket_id, actor_id, kind, detail) values ($1, $2, 'status', $3)",
        [ticket.id, admin.id, ticketStatusAdmin[status as keyof typeof ticketStatusAdmin]],
      );
  });

  if (!internal)
    await sendMail(
      ticket.customer_email,
      `[${ticketNo(ticket.number)}] Antwort auf Ihr Ticket: ${ticket.subject}`,
      `Guten Tag ${ticket.customer_name}\n\nDas CareCore-Team hat auf Ihr Ticket geantwortet:\n\n${body}\n\nZum Ticket: ${appUrl(
        `/konto/tickets/${ticket.id}`,
      )}\n\nFreundliche Grüsse\nCareCore Support`,
    );
  revalidatePath(path);
  redirect(`${path}?ok=antwort#ende`);
}

export async function adminUpdateTicket(data: FormData) {
  const admin = await requireAdmin();
  const ticket = await getTicket(String(data.get("ticket_id")));
  if (!ticket) redirect("/admin/tickets");
  const status = pick(ticketStatusAdmin, data.get("status")) ?? ticket.status;
  const priority = pick(ticketPriority, data.get("priority")) ?? ticket.priority;
  const category = pick(ticketCategory, data.get("category")) ?? ticket.category;
  const assigneeRaw = String(data.get("assignee_id") ?? "");
  const assignee = assigneeRaw
    ? ((await queryOne<{ id: string; name: string }>(
        "select id, name from app_users where id = $1 and role = 'admin'",
        [assigneeRaw],
      )) ?? null)
    : null;

  const changes: [string, string][] = [];
  if (status !== ticket.status) changes.push(["status", ticketStatusAdmin[status as keyof typeof ticketStatusAdmin]]);
  if (priority !== ticket.priority)
    changes.push(["prioritaet", ticketPriority[priority as keyof typeof ticketPriority]]);
  if (category !== ticket.category)
    changes.push(["kategorie", ticketCategory[category as keyof typeof ticketCategory]]);
  if ((assignee?.id ?? null) !== ticket.assignee_id) changes.push(["zuweisung", assignee?.name ?? "Niemand"]);

  if (changes.length)
    await transaction(async (client) => {
      await client.query(
        `update tickets set status = $2, priority = $3, category = $4, assignee_id = $5, updated_at = now(),
           closed_at = case when $2 = 'geschlossen' then coalesce(closed_at, now()) else null end
         where id = $1`,
        [ticket.id, status, priority, category, assignee?.id ?? null],
      );
      for (const [kind, detail] of changes)
        await client.query("insert into ticket_events (ticket_id, actor_id, kind, detail) values ($1, $2, $3, $4)", [
          ticket.id,
          admin.id,
          kind,
          detail,
        ]);
    });
  redirect(`/admin/tickets/${ticket.id}?ok=ticket_aktualisiert`);
}

export async function adminDeleteTicket(data: FormData) {
  const admin = await requireAdmin();
  const ticket = await getTicket(String(data.get("ticket_id")));
  if (!ticket) redirect("/admin/tickets");
  await transaction(async (client) => {
    await client.query("delete from tickets where id = $1", [ticket.id]);
    await audit(
      admin.id,
      "ticket_geloescht",
      "ticket",
      ticket.id,
      `${ticketNo(ticket.number)} ${ticket.subject}`,
      client,
    );
  });
  redirect("/admin/tickets?ok=geloescht");
}
