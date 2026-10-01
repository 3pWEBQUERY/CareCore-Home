import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import Brand from "@/app/components/brand";

const points = [
  "Support-Tickets erfassen und den Stand jederzeit sehen",
  "Bestellungen und Rechnungen an einem Ort",
  "Direkter Draht zum CareCore-Team",
];

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Brand inverted />
        <div>
          <p className="eyebrow eyebrow-light">Kundenportal</p>
          <h2>Ihr Zugang zu CareCore.</h2>
          <ul>
            {points.map((point) => (
              <li key={point}>
                <CheckCircle size={20} weight="fill" /> {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-aside-foot">
          <Link href="/impressum">Impressum</Link> · <Link href="/datenschutz">Datenschutz</Link>
        </p>
      </aside>
      <main className="auth-main" id="inhalt">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
