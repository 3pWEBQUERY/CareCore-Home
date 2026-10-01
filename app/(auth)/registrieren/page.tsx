import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/app/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Registrieren" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/konto");
  return (
    <>
      <h1>Kundenkonto erstellen</h1>
      <p className="auth-lead">Für Einrichtungen, die CareCore nutzen oder einführen möchten.</p>
      <RegisterForm />
      <p className="auth-switch">
        Bereits registriert? <Link href="/anmelden">Anmelden</Link>
      </p>
    </>
  );
}
