import { Prohibit, UserCheck } from "@phosphor-icons/react/dist/ssr";

const does = [
  "Dokumentiert, organisiert und verbindet die Pflege",
  "Erinnert an Termine und Kontrollen, die Ihre Einrichtung festlegt",
  "Zeigt Grenzwerte und Wechselwirkungshinweise Ihrer Einrichtung – mit Quelle",
  "Zählt Assessments wie Braden oder interRAI nach der veröffentlichten Methode aus",
  "Erstellt mit KI Entwürfe, die eine Fachperson prüft und übernimmt",
];

const doesNot = [
  "Stellt keine Diagnosen",
  "Berechnet keine Dosierungen",
  "Gibt keine eigenen Therapie- oder Behandlungsempfehlungen",
  "Enthält keine versteckten Regeln oder Vorgabewerte",
  "Ordnet über die KI keine Medikation an",
];

export default function Principles() {
  return (
    <section className="section section-principles" aria-labelledby="principles-title">
      <div className="container principles-layout">
        <div className="principles-copy">
          <p className="eyebrow">Klar abgegrenzt</p>
          <h2 id="principles-title">Die Entscheidung bleibt bei der Fachperson.</h2>
          <p className="section-lead">
            CareCore ist Software für Pflegedokumentation, Organisation und Kommunikation – und bewusst kein
            Medizinprodukt im Sinne der Medizinprodukteverordnung (MepV). Wir sagen Ihnen genau, was die Software tut
            und was nicht.
          </p>
        </div>
        <div className="principles-cards">
          <div className="principle-card">
            <p className="principle-head">
              <UserCheck size={20} weight="bold" /> Was CareCore tut
            </p>
            <ul>
              {does.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="principle-card principle-card-muted">
            <p className="principle-head">
              <Prohibit size={20} weight="bold" /> Was CareCore nicht tut
            </p>
            <ul>
              {doesNot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
