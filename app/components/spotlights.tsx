import { Check, CloudCheck, DeviceMobile, Lock, Signature, Warning, WifiSlash } from "@phosphor-icons/react/dist/ssr";

type Spotlight = {
  id: string;
  code: string;
  title: string;
  text: string;
  points: string[];
  visual: React.ReactNode;
};

function BtmBook() {
  const rows = [
    { date: "28.09. 07:58", kind: "Gabe", qty: "−1", stock: "15", by: "A. Meier", second: "—" },
    { date: "28.09. 19:40", kind: "Gabe", qty: "−1", stock: "14", by: "S. Rossi", second: "—" },
    { date: "29.09. 10:12", kind: "Eingang", qty: "+20", stock: "34", by: "A. Meier", second: "L. Keller" },
    { date: "30.09. 08:05", kind: "Kontrolle", qty: "±0", stock: "34", by: "L. Keller", second: "M. Brunner" },
    { date: "01.10. 07:55", kind: "Gabe", qty: "−1", stock: "33", by: "A. Meier", second: "—" },
  ];
  return (
    <div className="panel" role="img" aria-label="Beispiel eines BtM-Buchs mit laufendem Bestand und Zweitunterschrift">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">BtM-Buch · Bestand Wohnbereich Linde</p>
          <p className="panel-title">Morphin Tropfen 2 %</p>
        </div>
        <span className="chip chip-brand">
          <Lock size={12} weight="bold" /> unveränderlich
        </span>
      </div>
      <table className="panel-table">
        <thead>
          <tr>
            <th>Zeitpunkt</th>
            <th>Buchung</th>
            <th className="num">Menge</th>
            <th className="num">Bestand</th>
            <th>Person</th>
            <th>2. Unterschrift</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date}>
              <td className="mono">{row.date}</td>
              <td>{row.kind}</td>
              <td className="num mono">{row.qty}</td>
              <td className="num mono strong">{row.stock}</td>
              <td>{row.by}</td>
              <td>
                {row.second === "—" ? (
                  <span className="muted">—</span>
                ) : (
                  <span className="sig">
                    <Signature size={13} /> {row.second}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="panel-foot">
        <span>Gezählt 33 · erwartet 33</span>
        <span className="ok">
          <Check size={13} weight="bold" /> Keine Differenz
        </span>
      </div>
    </div>
  );
}

function RosterGrid() {
  const days = ["Mo 5", "Di 6", "Mi 7", "Do 8", "Fr 9", "Sa 10", "So 11"];
  const staff = [
    { name: "Aline B.", q: "HF", shifts: ["F", "F", "S", "–", "–", "F", "F"] },
    { name: "Elif K.", q: "FaGe", shifts: ["S", "S", "–", "F", "F", "–", "S"] },
    { name: "Marco R.", q: "HF", shifts: ["N", "N", "N", "–", "–", "S", "–"] },
    { name: "Sara L.", q: "SRK", shifts: ["–", "F", "F", "S", "N", "F", "–"] },
  ];
  return (
    <div className="panel" role="img" aria-label="Beispiel eines Dienstplans mit Warnung der Regel-Engine">
      <div className="panel-head">
        <div>
          <p className="panel-eyebrow">Dienstplan · Oktober · Entwurf</p>
          <p className="panel-title">Wohngruppe Ahorn</p>
        </div>
        <span className="chip chip-attention">1 Warnung</span>
      </div>
      <div className="roster">
        <span className="roster-corner" />
        {days.map((day) => (
          <span key={day} className={`roster-day${day.startsWith("Sa") || day.startsWith("So") ? " is-weekend" : ""}`}>
            {day}
          </span>
        ))}
        {staff.map((person) => (
          <div key={person.name} className="roster-row">
            <span className="roster-name">
              {person.name}
              <small>{person.q}</small>
            </span>
            {person.shifts.map((shift, index) => (
              <span
                key={index}
                className={`roster-cell shift-${shift === "–" ? "off" : shift}${
                  person.name === "Sara L." && index === 4 ? " has-warning" : ""
                }`}
              >
                {shift}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="panel-alert">
        <Warning size={15} weight="bold" />
        <span>
          <b>Ruhezeit unterschritten · Sara L., Fr 9 → Sa 10</b>
          Nachtdienst bis 07:00, Frühdienst ab 06:45. Speichern nur mit Begründung.
        </span>
      </div>
    </div>
  );
}

function ResidentRecord() {
  const log = [
    { time: "07:52", who: "A. Meier", what: "Vitalwerte erfasst", device: "Safari · iPad" },
    { time: "08:04", who: "A. Meier", what: "Reservegabe Paracetamol 500 mg", device: "Safari · iPad" },
    { time: "09:31", who: "Dr. R. Frei", what: "Verordnung angepasst", device: "Chrome · Windows" },
  ];
  return (
    <div
      className="panel panel-record"
      role="img"
      aria-label="Beispiel einer Bewohnerakte mit Reanimationsstatus und Änderungsprotokoll"
    >
      <div className="record-head">
        <span className="record-avatar">HM</span>
        <div>
          <p className="record-eyebrow">Bewohnerakte</p>
          <p className="record-name">Hans Müller</p>
          <p className="record-meta">Zimmer 207 · Wohnbereich Linde · geb. 14.03.1939</p>
        </div>
        <div className="record-badges">
          <span className="badge badge-critical">REA: Nein</span>
          <span className="badge badge-soft">Allergie: Penicillin</span>
        </div>
      </div>
      <div className="record-tabs">
        <span>Übersicht</span>
        <span>Stammdaten</span>
        <span>Dokumentation</span>
        <span className="is-active">Verlauf</span>
        <span>Dokumente</span>
      </div>
      <div className="record-body">
        <p className="panel-eyebrow">Änderungsprotokoll</p>
        {log.map((entry) => (
          <div key={entry.time} className="log-row">
            <time className="mono">{entry.time}</time>
            <span>
              <b>{entry.what}</b>
              {entry.who}
            </span>
            <em>{entry.device}</em>
          </div>
        ))}
        <div className="record-actions">
          <span className="btn-mini">Überleitungsbogen (A4)</span>
          <span className="btn-mini btn-mini-ghost">Pflegeplanung öffnen</span>
        </div>
      </div>
    </div>
  );
}

function OfflineStatus() {
  return (
    <div
      className="panel panel-offline"
      role="img"
      aria-label="Beispiel der Offline-Statusanzeige mit vorgemerkten Einträgen"
    >
      <div className="offline-bar">
        <WifiSlash size={16} weight="bold" />
        <span>
          <b>Offline</b> · Stand der Daten 06:42
        </span>
      </div>
      <div className="queue">
        <div className="queue-row">
          <DeviceMobile size={16} />
          <span>
            <b>Trinkmenge 200 ml</b>Ruth Baumann · erfasst 10:14
          </span>
          <em>vorgemerkt</em>
        </div>
        <div className="queue-row">
          <DeviceMobile size={16} />
          <span>
            <b>Dokumentation · Mobilisation</b>Peter Aebischer · erfasst 10:20
          </span>
          <em>vorgemerkt</em>
        </div>
        <div className="queue-row is-conflict">
          <Warning size={16} />
          <span>
            <b>Notiz „Angehörige informieren“</b>Auf einem anderen Gerät geändert
          </span>
          <em>Konflikt</em>
        </div>
        <div className="queue-actions">
          <span className="btn-mini">Meine Fassung übernehmen</span>
          <span className="btn-mini btn-mini-ghost">Verwerfen</span>
        </div>
      </div>
      <div className="offline-bar is-online">
        <CloudCheck size={16} weight="bold" />
        <span>
          <b>Wieder verbunden</b> · 2 Einträge mit Erfassungszeit gesendet
        </span>
      </div>
    </div>
  );
}

const spotlights: Spotlight[] = [
  {
    id: "medikation",
    code: "M06 · Medikation & BtM",
    title: "Medikation, die jede Gabe nachweist.",
    text: "Von der Medikamentenrunde bis zur Bestandskontrolle: CareCore führt Gaben, Reserven und Betäubungsmittel mit lückenlosem Nachweis – so, wie es die Einrichtung festlegt.",
    points: [
      "BtM-Buch mit laufendem Bestand – Buchungen sind per Datenbank-Trigger unveränderlich",
      "Zweitunterschrift mit eigenem Benutzernamen und Passwort der zweiten Person",
      "Reservegaben mit Wirkungskontrolle zum Zeitpunkt aus der ärztlichen Verordnung",
      "Getrennte Rechte für Verabreichen und Verwalten, gekoppelt an Qualifikationen",
      "Gaben werden nur online gebucht – so entstehen keine doppelten Gaben",
    ],
    visual: <BtmBook />,
  },
  {
    id: "dienstplan",
    code: "M16 · Dienstplan & Arbeitszeit",
    title: "Planen wie gewohnt. Geprüft wie nie.",
    text: "Die Leitung plant wie im PEP – Kürzel tippen, Bereiche kopieren, aus Excel einfügen. Jede Änderung läuft serverseitig durch die Regel-Engine, bevor sie gespeichert wird.",
    points: [
      "Blocker verhindern das Speichern, Warnungen verlangen eine Begründung",
      "Mindestbesetzung, Qualifikationen, Ruhezeiten und Feiertage je Einrichtung",
      "Tausch, Wunschfrei und Abwesenheiten mit Antrag und Freigabe",
      "Zeiterfassung mit Soll/Ist, Monatsabschluss und CSV für die Lohnbuchhaltung",
      "Optionale KI-Planung mit pseudonymisierten Daten – nur in Entwürfe",
    ],
    visual: <RosterGrid />,
  },
  {
    id: "akte",
    code: "M04 · Bewohnerakte",
    title: "Die Akte, die im Notfall Antworten hat.",
    text: "Reanimationsstatus, Allergien und Risiken stehen im Aktenkopf. Der Überleitungsbogen für Spitaleinweisung oder Verlegung entsteht mit einem Klick als A4-Druckansicht.",
    points: [
      "Reanimationsstatus mit Grundlage und Datum – ohne Voreinstellung",
      "Überleitungsbogen mit Medikation, Wunden, Vitalwerten und den letzten 72 Stunden",
      "Änderungsprotokoll mit Person, Sitzung und Gerät für die Leitung",
      "Dokumente werden am Inhalt geprüft, nicht nur am Dateityp",
      "Aufbewahrungsfrist der Einrichtung – gelöscht wird nie automatisch",
    ],
    visual: <ResidentRecord />,
  },
  {
    id: "offline",
    code: "Offline-Betrieb",
    title: "Dokumentieren, auch wenn das WLAN im Keller endet.",
    text: "Dokumentation, Vitalwerte, Trinkmenge, Mahlzeiten, Übergabenotizen und Wundverlauf lassen sich ohne Verbindung erfassen. Sie werden verschlüsselt vorgemerkt und später mit dem Zeitpunkt der Erfassung gesendet.",
    points: [
      "Zwischenspeicher verschlüsselt – der Schlüssel liegt nur im Arbeitsspeicher",
      "Jeder Eintrag hat eine Kennung: nichts entsteht doppelt",
      "Konflikte werden angezeigt statt stillschweigend überschrieben",
      "Gesendet wird nur mit der Sitzung der Person, die erfasst hat",
      "Abmelden löscht zwischengespeicherte Seiten und Daten auf dem Gerät",
    ],
    visual: <OfflineStatus />,
  },
];

export default function Spotlights() {
  return (
    <section className="section section-spotlights" aria-label="Funktionen im Detail">
      <div className="container">
        <div className="section-head section-head-center">
          <p className="eyebrow">Im Detail</p>
          <h2>Gebaut für die Abläufe, bei denen Fehler nicht passieren dürfen.</h2>
        </div>
        {spotlights.map((spot, index) => (
          <article key={spot.id} id={spot.id} className={`spotlight${index % 2 ? " is-reversed" : ""}`}>
            <div className="spotlight-copy">
              <p className="spotlight-code">{spot.code}</p>
              <h3>{spot.title}</h3>
              <p>{spot.text}</p>
              <ul className="checklist">
                {spot.points.map((point) => (
                  <li key={point}>
                    <Check size={16} weight="bold" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="spotlight-visual">{spot.visual}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
