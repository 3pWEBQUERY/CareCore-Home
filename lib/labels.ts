export const ticketStatus = {
  offen: "Offen",
  in_bearbeitung: "In Bearbeitung",
  wartet_auf_kunde: "Wartet auf Ihre Antwort",
  geloest: "Gelöst",
  geschlossen: "Geschlossen",
} as const;
export const ticketStatusAdmin = { ...ticketStatus, wartet_auf_kunde: "Wartet auf Kunde" } as const;
export const ticketTone: Record<string, string> = {
  offen: "info",
  in_bearbeitung: "brand",
  wartet_auf_kunde: "attention",
  geloest: "success",
  geschlossen: "muted",
};

export const ticketCategory = {
  frage: "Allgemeine Frage",
  technik: "Technisches Problem",
  abrechnung: "Abrechnung",
  schulung: "Schulung & Einführung",
  funktionswunsch: "Funktionswunsch",
  sonstiges: "Sonstiges",
} as const;

export const ticketPriority = { niedrig: "Niedrig", normal: "Normal", hoch: "Hoch", dringend: "Dringend" } as const;
export const priorityTone: Record<string, string> = {
  niedrig: "muted",
  normal: "info",
  hoch: "attention",
  dringend: "critical",
};

export const orderStatus = {
  angefragt: "Angefragt",
  bestaetigt: "Bestätigt",
  in_umsetzung: "In Umsetzung",
  abgeschlossen: "Abgeschlossen",
  storniert: "Storniert",
} as const;
export const orderTone: Record<string, string> = {
  angefragt: "attention",
  bestaetigt: "brand",
  in_umsetzung: "info",
  abgeschlossen: "success",
  storniert: "muted",
};

export const invoiceStatus = { offen: "Offen", bezahlt: "Bezahlt", storniert: "Storniert" } as const;
export const invoiceTone: Record<string, string> = { offen: "attention", bezahlt: "success", storniert: "muted" };

export const demoStatus = { neu: "Neu", kontaktiert: "Kontaktiert", erledigt: "Erledigt" } as const;
export const demoTone: Record<string, string> = { neu: "attention", kontaktiert: "brand", erledigt: "success" };

export const units = ["Monat", "Jahr", "einmalig", "Stunde", "Tag", "Stück", "Platz / Monat"] as const;

export function pick<T extends Record<string, string>>(map: T, value: FormDataEntryValue | null): keyof T | null {
  const key = String(value ?? "");
  return key in map ? (key as keyof T) : null;
}
