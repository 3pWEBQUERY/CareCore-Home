const questions = [
  {
    q: "Für welche Einrichtungen ist CareCore gedacht?",
    a: "Für Alters- und Pflegeheime sowie Einrichtungen der Langzeitpflege mit einem oder mehreren Wohnbereichen. Die Bezeichnung der betreuten Personen ist wählbar: Bewohner, Patient oder Klient.",
  },
  {
    q: "Wo werden unsere Daten gespeichert?",
    a: "Jede Einrichtung erhält eine eigene Installation mit eigener Datenbank und eigenem Dateispeicher im Rechenzentrum der Region Europa. Daten verschiedener Einrichtungen liegen nie in derselben Datenbank.",
  },
  {
    q: "Funktioniert CareCore ohne Internetverbindung?",
    a: "Ja, für die Erfassung am Bett: Dokumentation, Vitalwerte, Trinkmenge, Mahlzeiten, Übergabenotizen, Wundverlauf und der Abschluss von Aufgaben werden verschlüsselt vorgemerkt und später gesendet. Medikamentengaben und BtM-Buchungen sind bewusst nur online möglich.",
  },
  {
    q: "Ist CareCore ein Medizinprodukt?",
    a: "Nein. CareCore ist Software für Pflegedokumentation, Organisation und Kommunikation. Sie stellt keine Diagnosen, berechnet keine Dosierungen und gibt keine eigenen Behandlungsempfehlungen. Grenzwerte und Hinweise kommen von Ihrer Einrichtung.",
  },
  {
    q: "Was passiert mit der KI und unseren Daten?",
    a: "CareCore KI ist optional. Sie erstellt nur Entwürfe, die eine Fachperson prüft und übernimmt. Für die Dienstplanung gehen nur pseudonymisierte Daten an das Sprachmodell – keine Namen, Abwesenheitsgründe oder Freitexte. Ohne KI-Schlüssel läuft alles andere unverändert.",
  },
  {
    q: "Können wir bestehende Daten übernehmen?",
    a: "Bewohnerinnen, Bewohner und Mitarbeitende übernehmen Sie per CSV-Vorlage. CareCore prüft vorher jede Zeile auf Pflichtfelder, Datum, Wohnbereich, Rolle und Dubletten und übernimmt nur, wenn alles stimmt.",
  },
  {
    q: "Welche Sprachen unterstützt die Oberfläche?",
    a: "Deutsch, Französisch, Italienisch, Englisch, Albanisch, Kroatisch, Serbisch und Ungarisch. Übersetzungen werden von Ihrer Administration geprüft und freigegeben, bevor Mitarbeitende sie wählen können.",
  },
  {
    q: "Brauchen wir neue Geräte?",
    a: "Nein. CareCore läuft im Browser auf vorhandenen PCs, Tablets und Handys und lässt sich auf mobilen Geräten wie eine App zum Startbildschirm hinzufügen.",
  },
];

export default function Faq() {
  return (
    <section id="fragen" className="section section-faq" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div>
          <p className="eyebrow">Häufige Fragen</p>
          <h2 id="faq-title">Was Leitungen vor dem Entscheid wissen wollen.</h2>
          <p className="section-lead">
            Ihre Frage ist nicht dabei? Schreiben Sie uns – wir antworten persönlich und ohne Verkaufsfloskeln.
          </p>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
