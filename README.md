# CareCore – Website

Verkaufsseite für [CareCore](https://github.com/3pWEBQUERY/CareCore), den digitalen Arbeitsplatz für die Langzeitpflege.
Next.js (App Router) als statischer Export – das Ergebnis in `out/` läuft auf jedem Webserver oder CDN.

## Seiten

- `/` – Startseite: Hero mit App-Vorschau, Plattform (Kern-Diagramm), alle Module, Funktionen im Detail (Medikation &
  BtM, Dienstplan, Bewohnerakte, Offline), Mobil & Sprachen, Sicherheit & Datenschutz, Abgrenzung (kein
  Medizinprodukt), Schnittstellen, Einführung, Fragen, Kontakt.
- `/impressum/` – Impressum
- `/datenschutz/` – Datenschutzerklärung der Website (DSG, soweit anwendbar DSGVO)

## Vor der Veröffentlichung

1. In `lib/site.ts` alle Platzhalter in eckigen Klammern ersetzen: Firmenname, Rechtsform, Adresse, UID,
   Handelsregister, vertretungsberechtigte Person, E-Mail, Telefon, Erreichbarkeit und Hosting-Anbieter der Website.
   Impressum, Datenschutz, Kontakt und Fusszeile lesen alle von dort.
2. `NEXT_PUBLIC_SITE_URL` auf die öffentliche Adresse setzen (z. B. `https://www.carecore.ch`) – für Sitemap,
   `robots.txt` und Vorschaubilder.
3. Impressum und Datenschutzerklärung rechtlich prüfen lassen.

Die Inhalte beschreiben den Funktionsumfang des CareCore-Repositorys (Stand 1. Oktober 2026). Ändert sich die App,
Module in `lib/modules.tsx` und die Detailtexte in `app/components/` nachführen. Alle Aussagen halten sich an den
MepV-Entscheid der App: keine Diagnosen, keine Dosierungen, keine eigenen Behandlungsempfehlungen.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # schreibt die statische Website nach out/
npm start        # liefert out/ lokal aus
```

Die Website setzt keine Cookies, lädt keine externen Skripte und liefert Schriften selbst aus (`next/font`). Das
Kontaktformular öffnet das E-Mail-Programm mit einer vorbereiteten Anfrage und speichert nichts.
