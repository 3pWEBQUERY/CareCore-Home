import Link from "next/link";
import { ArrowRight, CheckCircle, Signature, WifiSlash, BellRinging } from "@phosphor-icons/react/dist/ssr";
import { moduleCount } from "@/lib/modules";
import AppMock from "./app-mock";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-copy">
        <p className="eyebrow">Pflegesoftware für Alters- und Pflegeheime · Schweiz</p>
        <h1 id="hero-title">
          Eine Schicht. Ein Bildschirm.
          <span>Die ganze Pflege.</span>
        </h1>
        <p className="lead">
          CareCore verbindet Pflegedokumentation, Medikation mit BtM-Buch, Wunden, Dienstplan und Übergabe in einem
          Arbeitsplatz – lückenlos protokolliert, offline nutzbar und für jede Einrichtung separat betrieben.
        </p>
        <div className="hero-actions">
          <Link href="/#kontakt" className="btn btn-primary btn-lg">
            Demo vereinbaren <ArrowRight size={18} weight="bold" />
          </Link>
          <Link href="/#module" className="btn btn-ghost btn-lg">
            Alle {moduleCount} Module ansehen
          </Link>
        </div>
        <ul className="hero-facts" aria-label="Auf einen Blick">
          <li>
            <CheckCircle size={18} weight="fill" /> Eigene Installation je Einrichtung
          </li>
          <li>
            <CheckCircle size={18} weight="fill" /> Hosting in Europa
          </li>
          <li>
            <CheckCircle size={18} weight="fill" /> Desktop, Tablet und Handy
          </li>
        </ul>
      </div>

      <div className="container hero-stage">
        <div className="hero-frame">
          <AppMock />
        </div>

        <div className="float-card float-btm" aria-hidden="true">
          <span className="float-icon tone-brand">
            <Signature size={18} />
          </span>
          <div>
            <strong>BtM-Eingang gebucht</strong>
            <span>Zweitunterschrift · L. Keller, HF</span>
          </div>
        </div>
        <div className="float-card float-push" aria-hidden="true">
          <span className="float-icon tone-attention">
            <BellRinging size={18} />
          </span>
          <div>
            <strong>Wirkungskontrolle fällig</strong>
            <span>Reservegabe 09:15 · Zimmer 207</span>
          </div>
        </div>
        <div className="float-card float-offline" aria-hidden="true">
          <span className="float-icon tone-ink">
            <WifiSlash size={18} />
          </span>
          <div>
            <strong>Offline · 3 Einträge vorgemerkt</strong>
            <span>Werden gesendet, sobald Verbindung besteht</span>
          </div>
        </div>
        <p className="mock-note">Darstellung mit Beispieldaten</p>
      </div>
    </section>
  );
}
