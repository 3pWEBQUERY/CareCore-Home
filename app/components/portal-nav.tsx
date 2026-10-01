"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChartPieSlice,
  ClipboardText,
  Cube,
  FileText,
  Lifebuoy,
  List,
  ListMagnifyingGlass,
  Package,
  Receipt,
  UserCircle,
  Users,
  X,
  EnvelopeSimpleOpen,
} from "@phosphor-icons/react";

const icons = {
  overview: ChartPieSlice,
  tickets: Lifebuoy,
  orders: Package,
  invoices: Receipt,
  profile: UserCircle,
  customers: Users,
  products: Cube,
  requests: EnvelopeSimpleOpen,
  log: ListMagnifyingGlass,
  docs: FileText,
  tasks: ClipboardText,
};

export type NavItem = { href: string; label: string; icon: keyof typeof icons; badge?: number; exact?: boolean };

export default function PortalNav({ items, children }: { items: NavItem[]; children?: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="portal-menu-toggle"
        aria-expanded={open}
        aria-controls="portal-nav"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Menü schliessen" : "Menü öffnen"}
      >
        {open ? <X size={22} /> : <List size={22} />}
      </button>
      <div id="portal-nav" className={`portal-nav${open ? " is-open" : ""}`}>
        <nav aria-label="Bereiche">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
                {item.badge ? <em>{item.badge}</em> : null}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </>
  );
}
