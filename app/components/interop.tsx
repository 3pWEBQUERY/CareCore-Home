import {
  EnvelopeSimple,
  FileCsv,
  IdentificationBadge,
  PlugsConnected,
  UsersFour,
  WebhooksLogo,
} from "@phosphor-icons/react/dist/ssr";

const items = [
  {
    icon: PlugsConnected,
    title: "HL7 FHIR R4",
    text: "Lesende Schnittstelle für Personen und Vitalwerte (LOINC), mit Schlüsseln je System und SMART-Scopes.",
  },
  {
    icon: WebhooksLogo,
    title: "Webhooks",
    text: "Angebundene Systeme erfahren Änderungen sofort – signiert mit HMAC-SHA256.",
  },
  {
    icon: IdentificationBadge,
    title: "SSO über OpenID Connect",
    text: "Anmeldung über Ihren Identity-Provider, z. B. Microsoft Entra ID, Google Workspace, Keycloak oder HIN.",
  },
  {
    icon: UsersFour,
    title: "Portal für Angehörige, Ärzte & Apotheken",
    text: "Freigaben je Person oder Wohnbereich und Bereich, mit Grundlage und Zeitraum. Widerruf wirkt sofort.",
  },
  {
    icon: FileCsv,
    title: "Datenübernahme per CSV",
    text: "Bewohner und Mitarbeitende mit Vorlage. Jede Zeile wird geprüft, übernommen wird nur vollständig.",
  },
  {
    icon: EnvelopeSimple,
    title: "E-Mail über Ihren Server",
    text: "Einladungen und „Passwort vergessen“ über jeden SMTP-Anbieter, auch den Mailserver der Einrichtung.",
  },
];

export default function Interop() {
  return (
    <section className="section section-interop" aria-labelledby="interop-title">
      <div className="container interop-layout">
        <div>
          <p className="eyebrow">Schnittstellen</p>
          <h2 id="interop-title">Offen, wo es Ihrer Einrichtung nützt.</h2>
          <p className="section-lead">
            CareCore spricht etablierte Standards. Freitexte, Fotos und Biografien verlassen das System über die
            Schnittstelle nicht – und jeder Zugriff erscheint im Protokoll.
          </p>
          <div className="code-card" aria-label="Beispiel einer FHIR-Abfrage">
            <div className="code-card-bar">
              <i />
              <i />
              <i />
              <span>FHIR R4 · Observation</span>
            </div>
            <pre>
              <code>
                <span className="c-key">GET</span> /api/fhir/r4/Observation{"\n"}
                {"    "}?patient=<span className="c-str">7c1e…a42</span>&amp;code=<span className="c-str">8867-4</span>
                {"\n"}
                {"    "}&amp;date=<span className="c-str">ge2026-09-01</span>
                {"\n"}
                <span className="c-key">Authorization:</span> Bearer cck_••••••••{"\n\n"}
                <span className="c-com">{"// 200 · application/fhir+json · Bundle (searchset)"}</span>
              </code>
            </pre>
          </div>
        </div>
        <ul className="interop-grid">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="interop-icon">
                <Icon size={22} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
