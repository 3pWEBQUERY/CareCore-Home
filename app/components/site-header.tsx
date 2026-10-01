"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { nav } from "@/lib/site";
import Brand from "./brand";

type Account = { name: string; href: string } | null;

export default function SiteHeader({ account }: { account: Account }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="container header-row">
        <Brand />
        <nav className="header-nav" aria-label="Hauptnavigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {account ? (
            <Link href={account.href} className="header-login">
              Mein Konto
            </Link>
          ) : (
            <Link href="/anmelden" className="header-login">
              Anmelden
            </Link>
          )}
          <Link href="/#kontakt" className="btn btn-primary btn-sm">
            Demo vereinbaren
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>
      <nav id="mobile-menu" className="mobile-menu" aria-label="Hauptnavigation mobil" hidden={!open}>
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href={account ? account.href : "/anmelden"} onClick={() => setOpen(false)}>
          {account ? "Mein Konto" : "Anmelden"}
        </Link>
        <Link href="/#kontakt" className="btn btn-primary" onClick={() => setOpen(false)}>
          Demo vereinbaren
        </Link>
      </nav>
    </header>
  );
}
