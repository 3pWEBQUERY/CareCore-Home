import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

// next/font lädt die Schriften beim Build und liefert sie selbst aus – kein Aufruf bei Google im Browser.
const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "CareCore – Pflegesoftware für Alters- und Pflegeheime",
    template: "%s · CareCore",
  },
  description:
    "CareCore ist der digitale Arbeitsplatz für die Langzeitpflege: Pflegedokumentation, Medikation mit BtM-Buch, Wunden, Dienstplan, RAI, Portal und Qualität – sicher, offline-fähig und für die Schweiz gebaut.",
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "CareCore",
    title: "CareCore – Pflegesoftware für Alters- und Pflegeheime",
    description: "Ein Arbeitsplatz für die ganze Pflege: dokumentieren, verabreichen, planen und übergeben.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b1f3a",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-CH" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
