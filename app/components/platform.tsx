import {
  CalendarDots,
  ChartLineUp,
  ChatsCircle,
  GraduationCap,
  Notebook,
  Pill,
  PlugsConnected,
  Bandaids,
} from "@phosphor-icons/react/dist/ssr";

const nodes = [
  { icon: Notebook, title: "Pflege & Dokumentation", text: "Akte, Verlauf, Pflegeplanung, RAI" },
  { icon: Pill, title: "Medikation & BtM", text: "Runde, Reserve, Bestände, BtM-Buch" },
  { icon: Bandaids, title: "Wunden & Vitalwerte", text: "Fotos, Fälligkeiten, Grenzwerte" },
  { icon: CalendarDots, title: "Dienstplan & Zeit", text: "Regel-Engine, Tausch, Zeiterfassung" },
  { icon: PlugsConnected, title: "Portal & Schnittstellen", text: "Angehörige, Ärzte, FHIR, Webhooks" },
  { icon: ChartLineUp, title: "Qualität & Kennzahlen", text: "Ereignisse, Massnahmen, Resident 360" },
  { icon: ChatsCircle, title: "Kommunikation", text: "Übergabe, Messenger, Kalender, Cloud" },
  { icon: GraduationCap, title: "Team & Wissen", text: "Schulungen, Standards, Lesebestätigung" },
];

const pillars = [
  {
    title: "Eine Akte",
    text: "Was in der Medikamentenrunde, am Wundbett oder in der Übergabe erfasst wird, steht sofort im Verlauf derselben Person.",
  },
  {
    title: "Ein Rechtekonzept",
    text: "Rollen und Qualifikationen gelten überall gleich – in der Navigation, im Formular und auf dem Server.",
  },
  {
    title: "Ein Protokoll",
    text: "Jede Änderung wird in derselben Transaktion protokolliert, mit Person, Sitzung und Gerät.",
  },
];

export default function Platform() {
  return (
    <section id="plattform" className="section section-platform" aria-labelledby="platform-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Plattform</p>
            <h2 id="platform-title">Ein Kern für das ganze Haus.</h2>
          </div>
          <p className="section-lead">
            Statt Insellösungen für Dokumentation, Medikation und Dienstplan arbeitet in CareCore jede Funktion mit
            denselben Bewohnerinnen und Bewohnern, denselben Rechten und demselben Protokoll.
          </p>
        </div>

        <div className="orbit" role="list" aria-label="Bereiche, die CareCore verbindet">
          <svg className="orbit-art" viewBox="0 0 600 600" aria-hidden="true">
            <circle cx="300" cy="300" r="248" className="orbit-ring" />
            <circle cx="300" cy="300" r="172" className="orbit-ring orbit-ring-dashed" />
            {nodes.map((_, index) => {
              const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <line
                  key={index}
                  x1={300 + Math.cos(angle) * 108}
                  y1={300 + Math.sin(angle) * 108}
                  x2={300 + Math.cos(angle) * 248}
                  y2={300 + Math.sin(angle) * 248}
                  className="orbit-spoke"
                />
              );
            })}
            <circle cx="300" cy="300" r="108" className="orbit-core-ring" />
            <path d="M300 192 A108 108 0 0 1 404 270" className="orbit-arc" />
            <path d="M196 330 A108 108 0 0 1 230 218" className="orbit-arc orbit-arc-soft" />
            <path d="M342 400 A108 108 0 0 1 250 396" className="orbit-arc" />
          </svg>
          <div className="orbit-core">
            {/* eslint-disable-next-line @next/next/no-img-element -- statischer Export */}
            <img src="/carecore-logo.png" alt="" width={64} height={60} />
            <b>CareCore</b>
            <span>Bewohner · Rechte · Protokoll</span>
          </div>
          {nodes.map(({ icon: Icon, title, text }, index) => {
            const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 41.3;
            const y = 50 + Math.sin(angle) * 41.3;
            return (
              <div
                key={title}
                role="listitem"
                className={`orbit-node ${Math.abs(x - 50) < 1 ? (y < 50 ? "is-top" : "is-bottom") : x < 50 ? "is-left" : "is-right"}`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="orbit-icon">
                  <Icon size={22} />
                </span>
                <span className="orbit-label">
                  <b>{title}</b>
                  <small>{text}</small>
                </span>
              </div>
            );
          })}
        </div>

        <ol className="pillars">
          {pillars.map((pillar, index) => (
            <li key={pillar.title}>
              <span className="pillar-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
