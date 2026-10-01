import type { Metadata } from "next";
import LegalPage from "@/app/components/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Wie die Website von CareCore mit Personendaten umgeht.",
};

export default function DatenschutzPage() {
  const { company } = site;
  return (
    <LegalPage eyebrow="Rechtliches" title="Datenschutzerklärung">
      <section>
        <p className="legal-intro">
          Diese Datenschutzerklärung gilt für die Website von CareCore. Sie richtet sich nach dem schweizerischen
          Bundesgesetz über den Datenschutz (DSG) und, soweit anwendbar, nach der Datenschutz-Grundverordnung der EU
          (DSGVO). Die Bearbeitung von Personendaten in der Pflegesoftware CareCore selbst regelt der Vertrag mit der
          jeweiligen Einrichtung (Auftragsbearbeitung).
        </p>
      </section>

      <section>
        <h2>1. Verantwortliche Stelle</h2>
        <p>
          {company.name}
          <br />
          {company.street}
          <br />
          {company.city}, {company.country}
          <br />
          E-Mail: <a href={`mailto:${company.email}`}>{company.email}</a>
          <br />
          Telefon: {company.phone}
        </p>
      </section>

      <section>
        <h2>2. Kurz zusammengefasst</h2>
        <ul>
          <li>Wir verwenden keine Analyse-, Werbe- oder Tracking-Dienste.</li>
          <li>
            Ein Cookie setzen wir nur, wenn Sie sich im Kundenportal anmelden: ein technisch notwendiges Sitzungs-Cookie
            („cch_session“, 14 Tage), das beim Abmelden gelöscht wird.
          </li>
          <li>
            Schriften und Symbole werden von unserem Server ausgeliefert – es werden keine Anfragen an Google oder
            andere Schriftanbieter gestellt.
          </li>
          <li>Wir verkaufen keine Personendaten und geben sie nicht zu Werbezwecken weiter.</li>
        </ul>
      </section>

      <section>
        <h2>3. Aufruf der Website und Server-Protokolle</h2>
        <p>
          Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten in Server-Protokollen:
          IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, übertragene Datenmenge, Referrer sowie Browser und
          Betriebssystem. Diese Daten dienen dem sicheren und stabilen Betrieb der Website, werden nicht mit anderen
          Daten zusammengeführt und nach kurzer Zeit gelöscht, sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls
          benötigt werden.
        </p>
        <p>
          Hosting-Anbieter der Website: {site.websiteHost}. Rechtsgrundlage nach DSGVO ist unser berechtigtes Interesse
          am sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section>
        <h2>4. Kontaktaufnahme</h2>
        <p>
          Wenn Sie uns per E-Mail, Telefon oder über das Formular „Demo vereinbaren“ kontaktieren, bearbeiten wir die
          mitgeteilten Angaben (z. B. Name, Einrichtung, Funktion, E-Mail-Adresse, Telefonnummer und Inhalt der
          Anfrage), um Ihre Anfrage zu beantworten und eine Demo zu organisieren. Rechtsgrundlage nach DSGVO sind
          vorvertragliche Massnahmen (Art. 6 Abs. 1 lit. b DSGVO) und unser berechtigtes Interesse an der Beantwortung
          von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <p>
          Wir bewahren Anfragen auf, solange es für die Bearbeitung nötig ist, und löschen sie danach, sofern keine
          gesetzlichen Aufbewahrungspflichten bestehen oder ein Vertrag zustande kommt.
        </p>
      </section>

      <section>
        <h2>4a. Kundenportal</h2>
        <p>
          Für das Kundenportal speichern wir die Angaben Ihres Kontos (Name, Einrichtung, Funktion, E-Mail-Adresse,
          Telefon, Rechnungsadresse und ein Passwort, das nur als Hash abgelegt wird), Ihre Support-Tickets mit
          Nachrichten und Anhängen, Bestellungen und Rechnungen sowie technische Angaben zu Ihren Anmeldungen
          (Zeitpunkt, Browser und Gerät). Zum Schutz vor Missbrauch halten wir Anmeldeversuche kurzzeitig fest.
          Änderungen an Konten, Bestellungen und Rechnungen werden protokolliert.
        </p>
        <p>
          Zweck ist die Erbringung unserer Leistungen, der Support und die Abrechnung. Rechtsgrundlage nach DSGVO ist
          die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Rechnungen bewahren wir so lange auf, wie es gesetzliche
          Aufbewahrungspflichten verlangen. Bitte schreiben Sie in Tickets keine Gesundheitsdaten von Bewohnerinnen und
          Bewohnern.
        </p>
      </section>

      <section>
        <h2>5. Weitergabe und Bekanntgabe ins Ausland</h2>
        <p>
          Personendaten geben wir nur an Dienstleister weiter, die wir für den Betrieb der Website und unsere
          Kommunikation benötigen (z. B. Hosting und E-Mail). Sie bearbeiten die Daten in unserem Auftrag und nach
          unseren Weisungen. Werden Daten in ein Land ohne angemessenes Datenschutzniveau bekannt gegeben, stellen wir
          den Schutz durch geeignete Garantien sicher, insbesondere durch die Standardvertragsklauseln der Europäischen
          Kommission.
        </p>
      </section>

      <section>
        <h2>6. Ihre Rechte</h2>
        <p>Sie haben im Rahmen des anwendbaren Rechts insbesondere das Recht,</p>
        <ul>
          <li>Auskunft über Ihre bei uns bearbeiteten Personendaten zu verlangen,</li>
          <li>unrichtige Personendaten berichtigen zu lassen,</li>
          <li>die Löschung oder Einschränkung der Bearbeitung zu verlangen,</li>
          <li>der Bearbeitung zu widersprechen und Ihre Daten herauszuverlangen (Datenübertragbarkeit),</li>
          <li>eine erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen.</li>
        </ul>
        <p>
          Wenden Sie sich dafür an <a href={`mailto:${company.email}`}>{company.email}</a>. Sie können sich zudem bei
          der zuständigen Aufsichtsbehörde beschweren, in der Schweiz beim Eidgenössischen Datenschutz- und
          Öffentlichkeitsbeauftragten (EDÖB), in der EU bei der Aufsichtsbehörde Ihres Aufenthaltsorts.
        </p>
      </section>

      <section>
        <h2>7. Datensicherheit</h2>
        <p>
          Die Website wird ausschliesslich verschlüsselt über HTTPS ausgeliefert. Wir treffen angemessene technische und
          organisatorische Massnahmen, um Personendaten vor unbefugtem Zugriff, Verlust und Missbrauch zu schützen.
        </p>
      </section>

      <section>
        <h2>8. Änderungen</h2>
        <p>
          Wir können diese Datenschutzerklärung anpassen, wenn sich die Website oder die rechtlichen Vorgaben ändern. Es
          gilt die auf dieser Seite veröffentlichte Fassung.
        </p>
      </section>
    </LegalPage>
  );
}
