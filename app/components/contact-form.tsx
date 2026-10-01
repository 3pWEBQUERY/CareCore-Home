"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitDemoRequest } from "@/app/actions/account";
import { ArrowRight } from "@phosphor-icons/react";

// Anfragen landen in der Datenbank (Administration › Anfragen) und – mit eingerichtetem E-Mail-Versand – im Postfach.
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitDemoRequest, undefined);

  if (state?.ok)
    return (
      <div className="contact-form contact-done" role="status">
        <p className="contact-done-title">Vielen Dank für Ihre Anfrage.</p>
        <p>Wir melden uns so rasch wie möglich, um einen Termin für die Demo zu vereinbaren.</p>
      </div>
    );

  return (
    <form className="contact-form" action={action}>
      {state?.error && (
        <p className="form-alert form-alert-error" role="alert">
          {state.error}
        </p>
      )}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="field-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Funktion</span>
          <input name="role" placeholder="z. B. Pflegedienstleitung" autoComplete="organization-title" />
        </label>
      </div>
      <label>
        <span>Einrichtung</span>
        <input name="organisation" autoComplete="organization" required />
      </label>
      <div className="field-row">
        <label>
          <span>E-Mail</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Telefon (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        <span>Anzahl Plätze (optional)</span>
        <select name="beds" defaultValue="">
          <option value="">Bitte wählen</option>
          <option>bis 40</option>
          <option>41–80</option>
          <option>81–150</option>
          <option>mehr als 150 / mehrere Standorte</option>
        </select>
      </label>
      <label>
        <span>Nachricht (optional)</span>
        <textarea name="message" rows={4} placeholder="Welche Abläufe sind Ihnen besonders wichtig?" />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        <span>
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Mehr dazu in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </span>
      </label>
      <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
        {pending ? "Wird gesendet …" : "Demo anfragen"} <ArrowRight size={18} weight="bold" />
      </button>
      <p className="form-note">Wir verwenden Ihre Angaben nur zur Bearbeitung dieser Anfrage.</p>
    </form>
  );
}
