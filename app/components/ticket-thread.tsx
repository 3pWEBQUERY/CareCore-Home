import { Paperclip, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { bytes, dateTime } from "@/lib/format";
import type { AttachmentRow, EventRow, MessageRow } from "@/lib/tickets";

type Entry = { at: Date; kind: "message"; message: MessageRow } | { at: Date; kind: "event"; event: EventRow };

const eventText: Record<string, string> = {
  erstellt: "hat das Ticket erstellt",
  status: "Status →",
  prioritaet: "Priorität →",
  kategorie: "Kategorie →",
  zuweisung: "Zugewiesen an",
};

export default function TicketThread({
  messages,
  attachments,
  events = [],
  viewer,
}: {
  messages: MessageRow[];
  attachments: AttachmentRow[];
  events?: EventRow[];
  viewer: "customer" | "admin";
}) {
  const entries: Entry[] = [
    ...messages.map((message) => ({ at: message.created_at, kind: "message" as const, message })),
    ...events
      .filter((e) => e.kind !== "erstellt")
      .map((event) => ({ at: event.created_at, kind: "event" as const, event })),
  ].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <ol className="thread">
      {entries.map((entry) =>
        entry.kind === "event" ? (
          <li key={`e${entry.event.id}`} className="thread-event">
            <span>
              {entry.event.actor_name ?? "System"} · {eventText[entry.event.kind] ?? entry.event.kind}{" "}
              <b>{entry.event.detail}</b>
            </span>
            <time>{dateTime(entry.event.created_at)}</time>
          </li>
        ) : (
          <li
            key={entry.message.id}
            className={`thread-msg${entry.message.author_role === "admin" ? " is-staff" : ""}${
              entry.message.internal ? " is-internal" : ""
            }`}
          >
            <div className="thread-meta">
              <span className="thread-avatar">{(entry.message.author_name ?? "?").slice(0, 1).toUpperCase()}</span>
              <b>
                {entry.message.author_role === "admin" && viewer === "customer"
                  ? `${entry.message.author_name} · CareCore Support`
                  : (entry.message.author_name ?? "Gelöschtes Konto")}
              </b>
              {entry.message.internal && (
                <span className="thread-internal">
                  <LockSimple size={12} weight="bold" /> Interne Notiz
                </span>
              )}
              <time>{dateTime(entry.message.created_at)}</time>
            </div>
            <div className="thread-body">{entry.message.body}</div>
            {attachments.some((a) => a.message_id === entry.message.id) && (
              <ul className="thread-files">
                {attachments
                  .filter((a) => a.message_id === entry.message.id)
                  .map((file) => (
                    <li key={file.id}>
                      <a href={`/api/anhang/${file.id}`}>
                        <Paperclip size={14} /> {file.file_name} <small>{bytes(file.size_bytes)}</small>
                      </a>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ),
      )}
    </ol>
  );
}
