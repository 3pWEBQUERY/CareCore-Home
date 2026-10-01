import Link from "next/link";

export default function Brand({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className={`brand${inverted ? " brand-inverted" : ""}`} aria-label="CareCore – zur Startseite">
      {/* eslint-disable-next-line @next/next/no-img-element -- statischer Export, Logo ist bereits optimiert */}
      <img src="/carecore-logo.png" alt="" width={34} height={32} />
      <span className="brand-word">
        CareCore
        <small>Pflegearbeitsplatz</small>
      </span>
    </Link>
  );
}
