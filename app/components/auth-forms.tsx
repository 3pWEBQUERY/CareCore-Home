"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, requestReset, resetPassword, type FormState } from "@/app/actions/auth";

function Notice({ state }: { state: FormState }) {
  if (state?.error)
    return (
      <p className="form-alert form-alert-error" role="alert">
        {state.error}
      </p>
    );
  if (state?.ok)
    return (
      <p className="form-alert form-alert-ok" role="status">
        {state.ok}
      </p>
    );
  return null;
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="stack">
      <Notice state={state} />
      <input type="hidden" name="weiter" value={next} />
      <label className="field">
        <span>E-Mail-Adresse</span>
        <input name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      </label>
      <label className="field">
        <span>
          Passwort <Link href="/passwort-vergessen">Vergessen?</Link>
        </span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? "Anmelden …" : "Anmelden"}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined);
  const v = state?.values ?? {};
  return (
    <form action={action} className="stack">
      <Notice state={state} />
      <div className="field-grid">
        <label className="field">
          <span>Vor- und Nachname</span>
          <input name="name" autoComplete="name" required defaultValue={v.name} />
        </label>
        <label className="field">
          <span>Funktion (optional)</span>
          <input name="role_title" placeholder="z. B. Heimleitung" defaultValue={v.role_title} />
        </label>
      </div>
      <label className="field">
        <span>Einrichtung</span>
        <input name="organisation" autoComplete="organization" required defaultValue={v.organisation} />
      </label>
      <label className="field">
        <span>E-Mail-Adresse</span>
        <input name="email" type="email" autoComplete="email" required defaultValue={v.email} />
      </label>
      <div className="field-grid">
        <label className="field">
          <span>Passwort</span>
          <input name="password" type="password" autoComplete="new-password" minLength={10} required />
        </label>
        <label className="field">
          <span>Passwort wiederholen</span>
          <input name="password2" type="password" autoComplete="new-password" minLength={10} required />
        </label>
      </div>
      <p className="field-hint">Mindestens 10 Zeichen mit Buchstaben und Ziffern.</p>
      <label className="check">
        <input type="checkbox" name="terms" required />
        <span>
          Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen.
        </span>
      </label>
      <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
        {pending ? "Konto wird erstellt …" : "Konto erstellen"}
      </button>
    </form>
  );
}

export function ResetRequestForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(requestReset, undefined);
  if (!enabled)
    return (
      <p className="form-alert">
        Der E-Mail-Versand ist noch nicht eingerichtet. Bitte wenden Sie sich an den Support – wir setzen Ihr Passwort
        zurück.
      </p>
    );
  return (
    <form action={action} className="stack">
      <Notice state={state} />
      <label className="field">
        <span>E-Mail-Adresse</span>
        <input name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      </label>
      <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
        Link senden
      </button>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, undefined);
  return (
    <form action={action} className="stack">
      <Notice state={state} />
      <input type="hidden" name="token" value={token} />
      <label className="field">
        <span>Neues Passwort</span>
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="field">
        <span>Passwort wiederholen</span>
        <input name="password2" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <button className="btn btn-primary btn-lg btn-block" disabled={pending}>
        Passwort speichern
      </button>
    </form>
  );
}
