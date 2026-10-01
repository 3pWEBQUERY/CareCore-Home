import type { Metadata } from "next";
import Link from "next/link";
import { ResetForm } from "@/app/components/auth-forms";

export const metadata: Metadata = { title: "Neues Passwort" };

export default async function ResetPage({ searchParams }: PageProps<"/passwort-zuruecksetzen">) {
  const { token } = await searchParams;
  return (
    <>
      <h1>Neues Passwort setzen</h1>
      {typeof token === "string" && token ? (
        <ResetForm token={token} />
      ) : (
        <p className="form-alert form-alert-error">Der Link ist unvollständig.</p>
      )}
      <p className="auth-switch">
        <Link href="/anmelden">Zurück zur Anmeldung</Link>
      </p>
    </>
  );
}
