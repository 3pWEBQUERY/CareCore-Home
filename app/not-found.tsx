import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="container container-narrow">
        <p className="eyebrow">Fehler 404</p>
        <h1>Diese Seite gibt es nicht.</h1>
        <p className="section-lead">
          Vielleicht wurde sie verschoben. Auf der Startseite finden Sie alle Bereiche von CareCore.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
