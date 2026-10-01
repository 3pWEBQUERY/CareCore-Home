import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/app/components/auth-forms";
import { mailEnabled } from "@/lib/mail";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Passwort vergessen" };

export default function ForgotPage() {
  return (
    <>
      <h1>Passwort vergessen</h1>
      <p className="auth-lead">Wir senden Ihnen einen Link, mit dem Sie ein neues Passwort setzen.</p>
      <ResetRequestForm enabled={mailEnabled()} />
      <p className="auth-switch">
        <Link href="/anmelden">Zurück zur Anmeldung</Link>
      </p>
    </>
  );
}
