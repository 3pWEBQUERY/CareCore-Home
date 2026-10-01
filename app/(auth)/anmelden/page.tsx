import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/components/auth-forms";
import { getCurrentUser, safeNext } from "@/lib/auth";

export const metadata: Metadata = { title: "Anmelden" };

export default async function LoginPage({ searchParams }: PageProps<"/anmelden">) {
  const params = await searchParams;
  const next = safeNext(typeof params.weiter === "string" ? params.weiter : null, "");
  const user = await getCurrentUser();
  if (user) redirect(next || (user.role === "admin" ? "/admin" : "/konto"));
  return (
    <>
      <h1>Anmelden</h1>
      <p className="auth-lead">Melden Sie sich mit Ihrem CareCore-Kundenkonto an.</p>
      {params.abgemeldet && <p className="form-alert form-alert-ok">Sie wurden abgemeldet.</p>}
      {params.passwort && (
        <p className="form-alert form-alert-ok">Ihr Passwort wurde geändert. Bitte melden Sie sich an.</p>
      )}
      <LoginForm next={next} />
      <p className="auth-switch">
        Noch kein Konto? <Link href="/registrieren">Jetzt registrieren</Link>
      </p>
    </>
  );
}
