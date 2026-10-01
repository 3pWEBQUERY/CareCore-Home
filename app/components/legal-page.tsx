import { site } from "@/lib/site";

export default function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="legal">
      <header className="legal-head">
        <div className="container container-narrow">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="legal-updated">Stand: {site.updated}</p>
        </div>
      </header>
      <div className="container container-narrow legal-body">{children}</div>
    </article>
  );
}
