import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  back,
}: {
  eyebrow?: string;
  title: string;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="page-head">
      <div>
        {back && (
          <Link href={back.href} className="page-back">
            ← {back.label}
          </Link>
        )}
        {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function Badge({ tone = "muted", children }: { tone?: string; children: React.ReactNode }) {
  return <span className={`badge-pill tone-${tone}`}>{children}</span>;
}

export function Card({
  title,
  eyebrow,
  actions,
  children,
  flush,
}: {
  title?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="card">
      {(title || actions) && (
        <div className="card-head">
          <div>
            {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
          {actions}
        </div>
      )}
      <div className={flush ? "card-body-flush" : "card-body"}>{children}</div>
    </section>
  );
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

const notices: Record<string, string> = {
  ticket_erstellt: "Ihr Ticket wurde erstellt. Wir melden uns so rasch wie möglich.",
  antwort: "Ihre Nachricht wurde gesendet.",
  ticket_geschlossen: "Das Ticket wurde geschlossen.",
  ticket_geoeffnet: "Das Ticket wurde wieder geöffnet.",
  ticket_aktualisiert: "Das Ticket wurde aktualisiert.",
  bestellung: "Ihre Bestellung ist eingegangen. Wir bestätigen sie in Kürze.",
  gespeichert: "Änderungen gespeichert.",
  passwort: "Ihr Passwort wurde geändert.",
  abgemeldet_andere: "Alle anderen Geräte wurden abgemeldet.",
  rechnung: "Die Rechnung wurde erstellt.",
  geloescht: "Eintrag entfernt.",
  angelegt: "Eintrag angelegt.",
};
const errors: Record<string, string> = {
  pflicht: "Bitte füllen Sie alle Pflichtfelder aus.",
  datei: "Die Datei ist zu gross (max. 5 MB) oder hat einen nicht erlaubten Typ (PDF, PNG, JPG, TXT, CSV, DOCX, XLSX).",
  passwort_falsch: "Das aktuelle Passwort stimmt nicht.",
  passwort_schwach: "Das neue Passwort braucht mindestens 10 Zeichen mit Buchstaben und Ziffern.",
  passwort_gleich: "Die neuen Passwörter stimmen nicht überein.",
  leer: "Bitte wählen Sie mindestens eine Position.",
  betrag: "Bitte einen gültigen Betrag angeben (z. B. 120.00).",
  status: "Diese Aktion ist im aktuellen Status nicht möglich.",
  email: "Diese E-Mail-Adresse wird bereits verwendet.",
  selbst: "Das eigene Konto kann so nicht geändert werden.",
};

export function Flash({ params }: { params: Record<string, string | string[] | undefined> }) {
  const ok = typeof params.ok === "string" ? notices[params.ok] : undefined;
  const error = typeof params.fehler === "string" ? errors[params.fehler] : undefined;
  if (!ok && !error) return null;
  return (
    <p className={`flash ${error ? "flash-error" : "flash-ok"}`} role={error ? "alert" : "status"}>
      {error ?? ok}
    </p>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className={`stat${tone ? ` stat-${tone}` : ""}`}>
      <span>{label}</span>
      <b>{value}</b>
      {hint && <small>{hint}</small>}
    </div>
  );
}
