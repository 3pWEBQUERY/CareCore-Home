import {
  Buildings,
  ClockCounterClockwise,
  Database,
  Fingerprint,
  Gauge,
  HardDrives,
  Key,
  ListMagnifyingGlass,
  LockKey,
  ShieldCheck,
  Trash,
  UserFocus,
} from "@phosphor-icons/react/dist/ssr";

const items = [
  {
    icon: Buildings,
    title: "Eigene Installation",
    text: "Jede Einrichtung erhält ihr eigenes Projekt mit eigener Datenbank und eigenem Speicher – keine geteilten Mandanten-Tabellen.",
  },
  {
    icon: HardDrives,
    title: "Hosting in Europa",
    text: "Betrieb im Rechenzentrum der Region Europa. Fotos und Dokumente liegen in einem privaten Speicher und werden nur mit Rechten ausgeliefert.",
  },
  {
    icon: ListMagnifyingGlass,
    title: "Lückenloses Protokoll",
    text: "Jede Änderung wird in derselben Datenbank-Transaktion protokolliert – mit Person, Sitzung und Gerät.",
  },
  {
    icon: Fingerprint,
    title: "Zwei-Faktor & Passkeys",
    text: "Authenticator-App (TOTP) mit Wiederherstellungscodes, Passkeys und Anmeldung über den Identity-Provider (OpenID Connect).",
  },
  {
    icon: LockKey,
    title: "Verschlüsselte Geheimnisse",
    text: "Zwei-Faktor-Geheimnisse und SSO-Zugangsdaten mit AES-256-GCM, Passwörter und Schlüssel nur als Hash.",
  },
  {
    icon: UserFocus,
    title: "Rechte nach Qualifikation",
    text: "Rollen je Einrichtung, kombiniert mit gültigen Qualifikationen – geprüft von derselben Datenbankfunktion für jede Anfrage.",
  },
  {
    icon: Gauge,
    title: "Drosselung",
    text: "Anmeldung, Zweitunterschrift und schreibende Anfragen werden begrenzt – gegen Skripte, Fehlschleifen und Passwort-Raten.",
  },
  {
    icon: ClockCounterClockwise,
    title: "Automatische Abmeldung",
    text: "Nach 15 Minuten bis 4 Stunden ohne Bedienung, über alle Tabs. Angemeldete Geräte sind sichtbar und einzeln abmeldbar.",
  },
  {
    icon: Trash,
    title: "Lösch- und Aufbewahrungskonzept",
    text: "Fristen legt die Einrichtung fest. Fällige Akten werden vorgeschlagen und nur einzeln mit Bestätigung gelöscht.",
  },
  {
    icon: Database,
    title: "Backups & Wiederherstellung",
    text: "Tägliche, wöchentliche und monatliche Sicherungen, optional Point-in-Time-Recovery. RPO und RTO werden vertraglich festgehalten.",
  },
  {
    icon: Key,
    title: "Eigene Daten mitnehmen",
    text: "Jede Person lädt ihre Daten als JSON herunter. Das Portal zeigt Angehörigen nur, was ausdrücklich freigegeben ist.",
  },
  {
    icon: ShieldCheck,
    title: "Geprüft vor jeder Version",
    text: "Unit-, Datenbank- und Klicktests laufen bei jeder Änderung – inklusive Handy-Ansicht und Tastaturbedienung.",
  },
];

export default function Security() {
  return (
    <section id="sicherheit" className="section section-dark" aria-labelledby="security-title">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow eyebrow-light">Sicherheit & Datenschutz</p>
            <h2 id="security-title">Gesundheitsdaten verdienen mehr als ein Häkchen.</h2>
          </div>
          <p className="section-lead">
            Datenschutz ist in CareCore keine Einstellung, sondern Architektur: getrennte Installationen, atomare
            Protokolle und Rechte, die bis zur Datenbank reichen.
          </p>
        </div>
        <ul className="security-grid">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon size={24} />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
