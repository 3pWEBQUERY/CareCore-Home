import type { Metadata } from "next";
import LegalPage from "../components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Angaben zum Anbieter von CareCore.",
};

export default function ImpressumPage() {
  const { company } = site;
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum">
      <section>
        <h2>Anbieter</h2>
        <dl className="legal-facts">
          <div>
            <dt>Unternehmen</dt>
            <dd>
              {company.name}, {company.legalForm}
            </dd>
          </div>
          <div>
            <dt>Adresse</dt>
            <dd>
              {company.street}
              <br />
              {company.city}
              <br />
              {company.country}
            </dd>
          </div>
          <div>
            <dt>Vertretungsberechtigt</dt>
            <dd>{company.representative}</dd>
          </div>
          <div>
            <dt>E-Mail</dt>
            <dd>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{company.phone}</dd>
          </div>
          <div>
            <dt>Unternehmens-Identifikationsnummer (UID)</dt>
            <dd>{company.uid}</dd>
          </div>
          <div>
            <dt>Handelsregister</dt>
            <dd>{company.register}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Produkt</h2>
        <p>
          CareCore ist Software für Pflegedokumentation, Organisation und Kommunikation in Einrichtungen der
          Langzeitpflege. CareCore ist kein Medizinprodukt im Sinne der schweizerischen Medizinprodukteverordnung
          (MepV): Die Software stellt keine Diagnosen, berechnet keine Dosierungen und gibt keine eigenen Therapie- oder
          Behandlungsempfehlungen. Fachliche Entscheidungen treffen die Fachpersonen der Einrichtung.
        </p>
      </section>

      <section>
        <h2>Haftungsausschluss</h2>
        <p>
          Wir prüfen die Inhalte dieser Website sorgfältig. Für Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit
          und Vollständigkeit der Informationen übernehmen wir jedoch keine Gewähr. Haftungsansprüche wegen Schäden
          materieller oder immaterieller Art, die aus dem Zugriff auf oder der Nutzung beziehungsweise Nichtnutzung der
          veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden
          sind, werden – soweit gesetzlich zulässig – ausgeschlossen.
        </p>
        <p>
          Die Darstellungen der Software auf dieser Website enthalten frei erfundene Beispieldaten. Ähnlichkeiten mit
          realen Personen sind zufällig. Massgebend für den Leistungsumfang ist allein der Vertrag mit der jeweiligen
          Einrichtung.
        </p>
      </section>

      <section>
        <h2>Haftung für Links</h2>
        <p>
          Verweise auf Websites Dritter liegen ausserhalb unseres Verantwortungsbereichs. Für deren Inhalte sind
          ausschliesslich die jeweiligen Betreiber verantwortlich. Der Zugriff und die Nutzung solcher Websites erfolgen
          auf eigene Gefahr.
        </p>
      </section>

      <section>
        <h2>Urheberrechte</h2>
        <p>
          Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Software und anderen Dateien auf dieser Website
          gehören {company.name} oder den ausdrücklich genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente
          ist die schriftliche Zustimmung im Voraus einzuholen.
        </p>
      </section>
    </LegalPage>
  );
}
