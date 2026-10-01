# CareCore – Website & Kundenportal

Verkaufsseite, Kundenportal und Administration für [CareCore](https://github.com/3pWEBQUERY/CareCore).
Next.js (App Router, Server Actions) mit PostgreSQL, betrieben auf Railway (Projekt **CareCore-Home**).

## Bereiche

| Pfad                                                | Inhalt                                                                                                                                                                |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                 | Verkaufsseite mit allen Modulen, Sicherheit, Einführung, FAQ und Formular „Demo vereinbaren“                                                                          |
| `/impressum`, `/datenschutz`                        | Rechtliches                                                                                                                                                           |
| `/registrieren`, `/anmelden`, `/passwort-vergessen` | Kundenkonto                                                                                                                                                           |
| `/konto`                                            | Kundenportal: Übersicht, Support-Tickets (mit Anhängen), Bestellungen, Rechnungen (Druck/PDF), Profil & Geräte                                                        |
| `/admin`                                            | Administration: Übersicht, Tickets (Status, Priorität, Zuweisung, interne Notizen), Demo-Anfragen, Kundschaft, Bestellungen, Rechnungen, Produkte & Preise, Protokoll |
| `/api/health`                                       | Zustand von App und Datenbank (für Railway)                                                                                                                           |

## Tickets

- Status: Offen → In Bearbeitung → Wartet auf Kunde → Gelöst → Geschlossen. Antwortet die Kundschaft auf ein Ticket
  „Wartet auf Kunde“ oder „Gelöst“, steht es wieder auf „Offen“.
- Interne Notizen sieht nur die Administration; Anhänge interner Notizen ebenso.
- Anhänge: bis 3 Dateien à 5 MB (PDF, PNG, JPG, TXT, CSV, DOCX, XLSX), am Inhalt geprüft, in der Datenbank gespeichert,
  nur für Berechtigte abrufbar.
- Jede Änderung (Status, Priorität, Kategorie, Zuweisung) steht im Verlauf des Tickets.

## Bestellungen & Rechnungen

Die Administration pflegt unter **Produkte & Preise** das Angebot. Kundschaft bestellt daraus im Portal (Status
„Angefragt“), die Administration bestätigt, ergänzt Positionen und erstellt die Rechnung. Rechnungen sind
unveränderliche Momentaufnahmen (Adresse, Positionen, Beträge) mit Nummer `RE-JJJJ-00001`, MWST je Satz,
Zahlungsfrist und Bankverbindung. Status: offen, bezahlt (mit Datum), storniert.

## Datenbank

Schema in `database/migrations/*.sql`, angewendet von `npm run db:migrate` (Prüfsumme je Datei, eine Transaktion pro
Datei). Auf Railway läuft das als Pre-Deploy-Befehl. Beim ersten Lauf entsteht das Administrationskonto aus
`CARECORE_ADMIN_EMAIL` und `CARECORE_ADMIN_PASSWORD` (mind. 12 Zeichen); weitere Administratoren ernennt man unter
Administration › Kundschaft.

## Umgebungsvariablen

| Variable                                                            | Pflicht | Zweck                                                                               |
| ------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                      | ja      | Railway: `${{Postgres.DATABASE_URL}}`                                               |
| `CARECORE_ADMIN_EMAIL`, `CARECORE_ADMIN_PASSWORD`                   | ja      | erstes Administrationskonto                                                         |
| `NEXT_PUBLIC_SITE_URL`, `APP_URL`                                   | ja      | öffentliche Adresse (Sitemap, Links in E-Mails)                                     |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM` | nein    | E-Mails: neue Tickets/Antworten, Bestellungen, Rechnungen, „Passwort vergessen“     |
| `NOTIFY_EMAIL`                                                      | nein    | zusätzliche Empfänger für Benachrichtigungen an die Administration (Komma-getrennt) |

Ohne SMTP läuft alles, nur ohne E-Mails; Passwörter setzt dann die Administration neu (Kundschaft › Konto › Passwort).

## Vor dem Livegang

1. In `lib/site.ts` die Platzhalter in eckigen Klammern ersetzen (Firma, Adresse, UID, MWST-Nr., Bank, IBAN …).
2. Impressum und Datenschutzerklärung rechtlich prüfen lassen.
3. Produkte & Preise in der Administration anlegen.

## Entwicklung

```bash
npm install
DATABASE_URL=postgres://… npm run db:migrate
DATABASE_URL=postgres://… npm run dev
npm run lint && npm run build
```
