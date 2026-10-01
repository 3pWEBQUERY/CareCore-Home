import PortalShell from "@/app/components/portal-shell";
import { requireUser } from "@/lib/auth";
import { queryOne } from "@/lib/db";

export default async function KontoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireUser();
  const counts = await queryOne<{ waiting: number; invoices: number }>(
    `select (select count(*)::int from tickets where customer_id = $1 and status = 'wartet_auf_kunde') as waiting,
            (select count(*)::int from invoices where customer_id = $1 and status = 'offen') as invoices`,
    [user.id],
  );
  const items = [
    { href: "/konto", label: "Übersicht", icon: "overview" as const, exact: true },
    { href: "/konto/tickets", label: "Support-Tickets", icon: "tickets" as const, badge: counts?.waiting },
    { href: "/konto/bestellungen", label: "Bestellungen", icon: "orders" as const },
    { href: "/konto/rechnungen", label: "Rechnungen", icon: "invoices" as const, badge: counts?.invoices },
    { href: "/konto/profil", label: "Profil & Sicherheit", icon: "profile" as const },
    ...(user.role === "admin" ? [{ href: "/admin", label: "Administration", icon: "log" as const }] : []),
  ];
  return (
    <PortalShell user={user} area="Kundenportal" items={items}>
      {children}
    </PortalShell>
  );
}
