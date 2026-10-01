import PortalShell from "@/app/components/portal-shell";
import { requireAdmin } from "@/lib/auth";
import { queryOne } from "@/lib/db";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();
  const counts = await queryOne<{ tickets: number; requests: number; orders: number }>(
    `select (select count(*)::int from tickets where status in ('offen')) as tickets,
            (select count(*)::int from demo_requests where status = 'neu') as requests,
            (select count(*)::int from orders where status = 'angefragt') as orders`,
  );
  const items = [
    { href: "/admin", label: "Übersicht", icon: "overview" as const, exact: true },
    { href: "/admin/tickets", label: "Tickets", icon: "tickets" as const, badge: counts?.tickets },
    { href: "/admin/anfragen", label: "Demo-Anfragen", icon: "requests" as const, badge: counts?.requests },
    { href: "/admin/kunden", label: "Kundschaft", icon: "customers" as const },
    { href: "/admin/bestellungen", label: "Bestellungen", icon: "orders" as const, badge: counts?.orders },
    { href: "/admin/rechnungen", label: "Rechnungen", icon: "invoices" as const },
    { href: "/admin/produkte", label: "Produkte & Preise", icon: "products" as const },
    { href: "/admin/protokoll", label: "Protokoll", icon: "log" as const },
    { href: "/admin/profil", label: "Mein Profil", icon: "profile" as const },
  ];
  return (
    <PortalShell user={user} area="Administration" items={items}>
      {children}
    </PortalShell>
  );
}
