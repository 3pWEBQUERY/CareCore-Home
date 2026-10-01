// Angaben zum Anbieter. Hier einmal pflegen – Impressum, Datenschutz, Kontakt und Fusszeile lesen von hier.
// Werte in eckigen Klammern sind Platzhalter und müssen vor der Veröffentlichung ersetzt werden.
export const site = {
  name: "CareCore",
  claim: "Pflegesoftware für die Langzeitpflege",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  company: {
    name: "[Firmenname]",
    legalForm: "[Rechtsform, z. B. GmbH]",
    street: "[Strasse Nr.]",
    city: "[PLZ Ort]",
    country: "Schweiz",
    uid: "[CHE-000.000.000]",
    register: "[Handelsregister des Kantons …]",
    representative: "[Vorname Nachname, Geschäftsführung]",
    email: "[kontakt@ihre-domain.ch]",
    phone: "[+41 00 000 00 00]",
    hours: "[Mo–Fr, 08:00–17:00]",
    vatNo: "[CHE-000.000.000 MWST]",
    bank: "[Bank, Ort]",
    iban: "[CH00 0000 0000 0000 0000 0]",
  },
  // Wo diese Website (nicht die Pflegesoftware) betrieben wird.
  websiteHost: "[Hosting-Anbieter der Website, Sitz, Land]",
  updated: "1. Oktober 2026",
} as const;

export const nav = [
  { href: "/#plattform", label: "Plattform" },
  { href: "/#module", label: "Module" },
  { href: "/#sicherheit", label: "Sicherheit" },
  { href: "/#einfuehrung", label: "Einführung" },
  { href: "/#fragen", label: "Fragen" },
] as const;
