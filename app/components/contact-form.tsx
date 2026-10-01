"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

// Die Website ist statisch und speichert nichts: Das Formular öffnet eine vorbereitete E-Mail im Mailprogramm.
export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const body = [
      `Name: ${value("name")}`,
      `Einrichtung: ${value("organisation")}`,
      `Funktion: ${value("role")}`,
      `E-Mail: ${value("email")}`,
      `Telefon: ${value("phone") || "–"}`,
      `Anzahl Plätze: ${value("beds") || "–"}`,
      "",
      value("message") || "Wir interessieren uns für eine Demo von CareCore.",
    ].join("\n");
    const subject = `Demo-Anfrage CareCore – ${value("organisation")}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
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
        <input type="checkbox" required />
        <span>
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Mehr dazu in der{" "}
          <Link href="/datenschutz/">Datenschutzerklärung</Link>.
        </span>
      </label>
      <button type="submit" className="btn btn-primary btn-lg">
        Anfrage per E-Mail senden <ArrowRight size={18} weight="bold" />
      </button>
      <p className="form-note" role="status">
        {sent
          ? "Ihr E-Mail-Programm sollte sich jetzt mit der vorbereiteten Anfrage öffnen."
          : "Öffnet Ihr E-Mail-Programm mit der vorbereiteten Anfrage. Diese Website speichert keine Formulardaten."}
      </p>
    </form>
  );
}
