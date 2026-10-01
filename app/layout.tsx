import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { site } from "@/lib/site";
import "./globals.css";
import "./portal.css";

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
        {/* Neuladen beginnt immer oben: keine Wiederherstellung der Scroll-Position, kein Sprung zu einem #Anker. */}
        <Script id="scroll-top" strategy="beforeInteractive">
          {`try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){history.scrollRestoration="manual";if(location.hash)history.replaceState(history.state,"",location.pathname+location.search);var t=function(){window.scrollTo({top:0,left:0,behavior:"instant"})};t();document.addEventListener("DOMContentLoaded",t);window.addEventListener("load",t)}}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
