import Link from "next/link";
import { ArrowSquareOut, SignOut } from "@phosphor-icons/react/dist/ssr";
import { logout } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/auth";
import PortalNav, { type NavItem } from "./portal-nav";

export default function PortalShell({
  user,
  area,
  items,
  children,
}: {
  user: SessionUser;
  area: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="portal">
      <aside className="portal-side">
        <div className="portal-brand">
          <Link href="/" aria-label="Zur Website">
            {/* eslint-disable-next-line @next/next/no-img-element -- kleines Logo */}
            <img src="/carecore-logo.png" alt="" width={30} height={28} />
            <span>
              CareCore
              <small>{area}</small>
            </span>
          </Link>
        </div>
        <PortalNav items={items}>
          <div className="portal-user">
            <span className="portal-avatar">{initials}</span>
            <span className="portal-user-text">
              <b>{user.name}</b>
              <small>{user.organisation || user.email}</small>
            </span>
          </div>
          <div className="portal-side-actions">
            <Link href="/">
              <ArrowSquareOut size={16} /> Zur Website
            </Link>
            <form action={logout}>
              <button type="submit">
                <SignOut size={16} /> Abmelden
              </button>
            </form>
          </div>
        </PortalNav>
      </aside>
      <main className="portal-main" id="inhalt">
        {children}
      </main>
    </div>
  );
}
