const steps = [
  {
    title: "Kennenlernen",
    text: "Wir zeigen CareCore an Ihren Abläufen – Medikamentenrunde, Übergabe, Dienstplan – und klären Umfang und Rollen.",
    meta: "Demo vor Ort oder online",
  },
  {
    title: "Eigene Installation",
    text: "Ihre Einrichtung erhält ein eigenes Projekt mit eigener Datenbank, eigenem Speicher, Backups und Überwachung.",
    meta: "Hosting in Europa",
  },
  {
    title: "Ersteinrichtung",
    text: "Die Checkliste führt durch Organisation, Standort, Wohnbereiche, E-Mail-Versand und Zwei-Faktor für die Administration.",
    meta: "Geführte Checkliste",
  },
  {
    title: "Datenübernahme",
    text: "Bewohner und Mitarbeitende kommen per CSV-Vorlage. Jede Zeile wird geprüft, bevor etwas übernommen wird.",
    meta: "CSV mit Prüfung",
  },
  {
    title: "Start im Alltag",
    text: "Mitarbeitende erhalten ihre Einladung per E-Mail. Regelwerk, Grenzwerte und Fristen legt Ihre Leitung fest.",
    meta: "Betrieb & Support",
  },
];

export default function Rollout() {
  return (
    <section id="einfuehrung" className="section section-rollout" aria-labelledby="rollout-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Einführung</p>
            <h2 id="rollout-title">Vom ersten Gespräch bis zur ersten Schicht.</h2>
          </div>
          <p className="section-lead">
            Eine Pflegesoftware wechselt man nicht nebenbei. Deshalb ist die Einführung bei CareCore ein klarer Ablauf –
            mit Ihrer Leitung als Entscheidungsinstanz für jede fachliche Regel.
          </p>
        </div>
        <ol className="steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="step-meta">{step.meta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
