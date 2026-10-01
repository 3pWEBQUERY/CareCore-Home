import {
  Bandaids,
  Bell,
  CalendarDots,
  ChartLineUp,
  Drop,
  Handshake,
  House,
  IdentificationCard,
  ListChecks,
  MagnifyingGlass,
  Notebook,
  Pill,
  Warning,
} from "@phosphor-icons/react/dist/ssr";

const sideItems = [
  { icon: House, label: "Startseite", active: true },
  { icon: Handshake, label: "Mein Dienst" },
  { icon: ListChecks, label: "Aufgaben" },
  { icon: IdentificationCard, label: "Bewohner" },
  { icon: Notebook, label: "Dokumentation" },
  { icon: Pill, label: "Medikation" },
  { icon: Drop, label: "Vitalwerte" },
  { icon: Bandaids, label: "Wunden" },
  { icon: CalendarDots, label: "Dienstplan" },
  { icon: ChartLineUp, label: "Kennzahlen" },
];

const tasks = [
  { time: "08:00", who: "Hans Müller · 207", what: "Medikamentenrunde Morgen", state: "done" },
  { time: "08:30", who: "Ruth Baumann · 211", what: "Verbandwechsel Sakrum", state: "partial" },
  { time: "09:00", who: "Maria Keller · 204", what: "Blutzucker messen", state: "open" },
  { time: "09:30", who: "Peter Aebischer · 103", what: "Mobilisation mit Rollator", state: "open" },
] as const;

const stateLabel = { done: "✓ erledigt", partial: "△ teilweise", open: "offen" } as const;

// Nachbildung der Startseite „Mein Dienst · Heute“ – rein dekorativ, Inhalte sind Beispieldaten.
export default function AppMock() {
  return (
    <div
      className="mock"
      role="img"
      aria-label="Vorschau der CareCore-Startseite mit Tagesliste, Kennzahlen und Hinweisen"
    >
      <aside className="mock-side">
        <div className="mock-side-brand">
          <span className="mock-logo" />
          <div>
            <b>CareCore</b>
            <small>Mehr Zeit für Pflege</small>
          </div>
        </div>
        <p className="mock-side-group">Pflege &amp; Klinik</p>
        {sideItems.map(({ icon: Icon, label, active }) => (
          <span key={label} className={`mock-side-item${active ? " is-active" : ""}`}>
            <Icon size={14} /> {label}
          </span>
        ))}
      </aside>
      <div className="mock-main">
        <div className="mock-top">
          <span className="mock-unit">
            <small>Alterszentrum Sonnengarten</small>
            Wohnbereich Linde
          </span>
          <span className="mock-search">
            <MagnifyingGlass size={12} /> Suchen …<kbd>⌘K</kbd>
          </span>
          <span className="mock-bell">
            <Bell size={14} />
            <i />
          </span>
          <span className="mock-user">
            <b>AM</b>
            <span>
              <small>Pflegefachfrau HF</small>Anna Meier
            </span>
          </span>
        </div>
        <div className="mock-body">
          <p className="mock-eyebrow">Mein Dienst · Frühdienst 06:45–15:15</p>
          <h3 className="mock-title">Guten Morgen, Anna</h3>
          <div className="mock-kpis">
            <span>
              <b>12</b>Bewohner im Bereich
            </span>
            <span>
              <b>7</b>Aufgaben offen
            </span>
            <span className="is-attention">
              <b>2</b>Wunden fällig
            </span>
            <span>
              <b>3</b>Übergaben ungelesen
            </span>
          </div>
          <div className="mock-alert">
            <Warning size={14} weight="bold" />
            <span>
              <b>Sturzrisiko erhöht · Hans Müller</b>
              Nach Sturzereignis neurologische Kontrollen bis 14:00 Uhr.
            </span>
          </div>
          <div className="mock-grid">
            <div className="mock-card">
              <p className="mock-card-head">
                Tagesliste <small>Kritisch · Wichtig · Routine</small>
              </p>
              {tasks.map((task) => (
                <div key={task.what} className="mock-task">
                  <time>{task.time}</time>
                  <span>
                    <b>{task.what}</b>
                    {task.who}
                  </span>
                  <em className={`state-${task.state}`}>{stateLabel[task.state]}</em>
                </div>
              ))}
            </div>
            <div className="mock-card">
              <p className="mock-card-head">
                Vitalwerte <small>Maria Keller</small>
              </p>
              <svg viewBox="0 0 200 64" className="mock-spark" aria-hidden="true">
                <rect x="0" y="16" width="200" height="22" className="spark-band" />
                <polyline points="0,40 25,34 50,36 75,28 100,30 125,22 150,26 175,18 200,24" className="spark-line" />
                <circle cx="200" cy="24" r="3" className="spark-dot" />
              </svg>
              <div className="mock-vitals">
                <span>
                  <small>Blutdruck</small>
                  <b>132/84</b>
                </span>
                <span>
                  <small>Puls</small>
                  <b>76</b>
                </span>
                <span>
                  <small>SpO₂</small>
                  <b>96 %</b>
                </span>
              </div>
              <p className="mock-foot">Grenzwerte gemäss Verordnung der Einrichtung</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
