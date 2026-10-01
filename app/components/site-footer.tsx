import Link from "next/link";
import { site } from "@/lib/site";
import Brand from "./brand";

const columns = [
  {
    title: "Produkt",
    links: [
      { href: "/#plattform", label: "Plattform" },
      { href: "/#module", label: "Alle Module" },
      { href: "/#medikation", label: "Medikation & BtM" },
      { href: "/#dienstplan", label: "Dienstplan" },
      { href: "/#offline", label: "Offline-Betrieb" },
    ],
  },
  {
    title: "Vertrauen",
    links: [
      { href: "/#sicherheit", label: "Sicherheit & Datenschutz" },
      { href: "/#einfuehrung", label: "Einführung" },
      { href: "/#fragen", label: "Häufige Fragen" },
      { href: "/#kontakt", label: "Demo vereinbaren" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutzerklärung" },
    ],
  },
];

export default function SiteFooter() {
  const { company } = site;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Brand inverted />
          <p>Der digitale Arbeitsplatz für die Langzeitpflege – dokumentieren, verabreichen, planen und übergeben.</p>
          <address>
            {company.name}
            <br />
            {company.street}
            <br />
            {company.city}, {company.country}
            <br />
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <br />
            {company.phone}
          </address>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="footer-col">
            <p>{column.title}</p>
            <ul>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container">
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.name}. Alle Rechte vorbehalten.
          </span>
          <span>CareCore ist kein Medizinprodukt im Sinne der MepV.</span>
        </div>
      </div>
    </footer>
  );
}
