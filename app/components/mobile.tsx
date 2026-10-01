import {
  Bandaids,
  BellRinging,
  Drop,
  Handshake,
  House,
  ListChecks,
  Notebook,
  Pill,
  Plus,
  UserCircle,
  Heartbeat,
} from "@phosphor-icons/react/dist/ssr";

const actions = [
  { icon: Notebook, label: "Dokumentation" },
  { icon: Heartbeat, label: "Vitalwerte" },
  { icon: Drop, label: "Trinkmenge" },
  { icon: Pill, label: "Reservegabe" },
  { icon: Bandaids, label: "Wundverlauf" },
  { icon: Handshake, label: "Übergabe" },
];

const facts = [
  { title: "Als App installieren", text: "Auf Tablet und Handy zum Startbildschirm hinzufügen – ohne App-Store." },
  {
    title: "Schnellaktionen am Bett",
    text: "Der „+“-Knopf öffnet die Erfassung für die gewählte Person, nur mit passenden Rechten.",
  },
  {
    title: "Push mit Ruhezeit",
    text: "Erinnerungen auf dem Gerät. Auf dem Sperrbildschirm steht nur der Titel, nie der Text.",
  },
  {
    title: "Lesbar für alle",
    text: "Schriftgrösse, Kontrast, reduzierte Animationen und dunkles Erscheinungsbild je Person.",
  },
];

const languages = [
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "en", name: "English" },
  { code: "sq", name: "Shqip" },
  { code: "hr", name: "Hrvatski" },
  { code: "sr-Latn", name: "Srpski" },
  { code: "hu", name: "Magyar" },
];

export default function Mobile() {
  return (
    <section className="section section-mobile" aria-labelledby="mobile-title">
      <div className="container mobile-layout">
        <div className="phone" role="img" aria-label="CareCore auf dem Handy mit geöffneten Schnellaktionen">
          <div className="phone-notch" />
          <div className="phone-screen">
            <div className="phone-top">
              <span>
                <small>Zimmer 211</small>Ruth Baumann
              </span>
              <BellRinging size={18} />
            </div>
            <div className="phone-card">
              <small>Nächste Aufgabe · 10:30</small>
              <b>Lagewechsel rechts</b>
              <span className="phone-tags">
                <i>✓</i>
                <i>△</i>
                <i>✕</i>
              </span>
            </div>
            <div className="phone-sheet">
              <p>Schnellaktionen · Ruth Baumann</p>
              <div className="phone-actions">
                {actions.map(({ icon: Icon, label }) => (
                  <span key={label}>
                    <Icon size={20} />
                    {label}
                  </span>
                ))}
              </div>
              <span className="phone-fab">
                <Plus size={22} weight="bold" />
              </span>
            </div>
            <div className="phone-nav">
              <House size={20} weight="fill" />
              <ListChecks size={20} />
              <Notebook size={20} />
              <UserCircle size={20} />
            </div>
          </div>
        </div>

        <div className="mobile-copy">
          <p className="eyebrow">Am Bett, im Büro, unterwegs</p>
          <h2 id="mobile-title">Dort, wo gepflegt wird.</h2>
          <p className="section-lead">
            CareCore läuft im Browser auf Desktop, Tablet und Handy. Die Oberfläche passt sich an – von der
            Planungsansicht der Leitung bis zur Erfassung mit einer Hand im Zimmer.
          </p>
          <dl className="fact-list">
            {facts.map((fact) => (
              <div key={fact.title}>
                <dt>{fact.title}</dt>
                <dd>{fact.text}</dd>
              </div>
            ))}
          </dl>
          <div className="languages">
            <p>Oberfläche in acht Sprachen – jede Übersetzung geprüft und freigegeben durch Ihre Administration.</p>
            <ul>
              {languages.map((language) => (
                <li key={language.code} lang={language.code}>
                  {language.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
