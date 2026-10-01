import type { Icon } from "@phosphor-icons/react";
import {
  Bandaids,
  Brain,
  CalendarDots,
  ChartLineUp,
  ChatsCircle,
  ClipboardText,
  Clock,
  CloudArrowUp,
  Drop,
  FileText,
  GearSix,
  GraduationCap,
  Handshake,
  IdentificationCard,
  ListChecks,
  Notebook,
  Pill,
  SealCheck,
  Stethoscope,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export type Module = {
  code: string;
  name: string;
  icon: Icon;
  text: string;
  items: string[];
};

export type ModuleGroup = { id: string; label: string; lead: string; modules: Module[] };

// Gliederung wie die Navigation der App (Mein Dienst, Bewohner & Pflege, Team & Wissen, CareCore One, Leitung, KI).
export const moduleGroups: ModuleGroup[] = [
  {
    id: "dienst",
    label: "Mein Dienst",
    lead: "Was die Schicht heute braucht – auf einem Bildschirm.",
    modules: [
      {
        code: "01",
        name: "Schicht & Übergabe",
        icon: Handshake,
        text: "Tagesliste nach Kritisch, Wichtig und Routine. Übergabe mit Lesebestätigung und „Seit meinem letzten Dienst“.",
        items: ["Heute", "Übergabe", "Seit letztem Dienst", "Verlauf"],
      },
      {
        code: "02",
        name: "Aufgaben",
        icon: ListChecks,
        text: "Abschluss mit ✓ erledigt, △ teilweise oder ✕ nicht erledigt. Abweichungen landen begründet in der Dokumentation.",
        items: ["Meine Aufgaben", "Team", "Eskalation", "Wiederkehrend"],
      },
      {
        code: "03",
        name: "Mein Dienstplan",
        icon: Clock,
        text: "Eigene Dienste, Stempeln mit Pause, Teamplan der Wohngruppe und Anträge für Wunschfrei, Abwesenheit und Tausch.",
        items: ["Meine Dienste", "Teamplan", "Anträge", "Zeiten"],
      },
    ],
  },
  {
    id: "pflege",
    label: "Bewohner & Pflege",
    lead: "Die vollständige Akte – vom Eintritt bis zum Überleitungsbogen.",
    modules: [
      {
        code: "04",
        name: "Bewohnerakte",
        icon: IdentificationCard,
        text: "Stammdaten, Kontakte, Biografie, Körperstatus, Dokumente und Reanimationsstatus mit Grundlage im Aktenkopf.",
        items: ["Übersicht", "Pflegeakten", "Verlauf & Archiv", "Überleitungsbogen"],
      },
      {
        code: "05",
        name: "Pflegedokumentation",
        icon: Notebook,
        text: "Schnelldokumentation, Nachträge und Verlauf. Diktieren mit Spracherkennung direkt auf dem Gerät.",
        items: ["Schnelldokumentation", "Verlauf", "Nachträge", "Diktat"],
      },
      {
        code: "06",
        name: "Medikation & BtM",
        icon: Pill,
        text: "Medikamentenrunde, Reserven mit Wirkungskontrolle, Bestände, Bestellungen und ein lückenloses BtM-Buch.",
        items: ["Medikamentenrunde", "Medikamentenplan", "Reserven", "Bestände", "BtM-Kontrolle", "Bestellungen"],
      },
      {
        code: "07",
        name: "Vitalwerte & Ernährung",
        icon: Drop,
        text: "Messwerte mit individuellen Grenzwerten je Person, Trinkprotokoll, Ernährungsplan und Screenings.",
        items: ["Vitalwerte", "Entwicklung", "Trinkprotokoll", "Ernährungsplan", "Grenzwerte"],
      },
      {
        code: "08",
        name: "Wundmanagement",
        icon: Bandaids,
        text: "Wundverlauf mit Fotos und Körperkarte. Fällige Verbandwechsel werden berechnet und der zuständigen Person gemeldet.",
        items: ["Wundübersicht", "Dokumentation", "Fotos", "Material"],
      },
      {
        code: "09",
        name: "Pflegeplanung & Einschätzungen",
        icon: ClipboardText,
        text: "Ziele, Massnahmen und Evaluation. Assessments wie Braden werden nach der veröffentlichten Methode ausgezählt.",
        items: ["Pflegeplanung", "Ziele & Massnahmen", "Auswertung", "Einschätzungen", "Fälligkeiten"],
      },
      {
        code: "10",
        name: "RAI / interRAI",
        icon: Stethoscope,
        text: "Erfassung, Fälligkeiten und Berichte für die interRAI-Einschätzung – auch vollständig per Tastatur bedienbar.",
        items: ["Übersicht", "Erfassung", "Fälligkeiten", "Berichte"],
      },
    ],
  },
  {
    id: "team",
    label: "Team & Wissen",
    lead: "Informiert, geschult und auf demselben Stand.",
    modules: [
      {
        code: "11",
        name: "Team-Neuigkeiten",
        icon: UsersThree,
        text: "Kanäle und Beiträge mit Lesebestätigung, damit wichtige Informationen nachweislich ankommen.",
        items: ["Kanäle", "Beiträge", "Lesebestätigung"],
      },
      {
        code: "12",
        name: "Schulungen",
        icon: GraduationCap,
        text: "Pflichtschulungen mit Gültigkeit, Nachweisen und Quiz mit Bestehensgrenze. Übersicht je Team.",
        items: ["Meine Schulungen", "Pflichtnachweise", "Quiz"],
      },
      {
        code: "13",
        name: "Standards & Dokumente",
        icon: FileText,
        text: "Weisungen mit Versionen und Freigabe. Eine neue Version verlangt die Lesebestätigung erneut.",
        items: ["Standards & Weisungen", "Dokumente", "Versionen"],
      },
    ],
  },
  {
    id: "one",
    label: "CareCore One",
    lead: "Kommunikation und Ablage, ohne private Messenger.",
    modules: [
      {
        code: "14",
        name: "Messenger",
        icon: ChatsCircle,
        text: "Direkt- und Gruppenunterhaltungen mit @Erwähnungen, Reaktionen und Push. Portal-Nachrichten an einem Ort.",
        items: ["Nachrichten", "Portal-Nachrichten", "Erwähnungen"],
      },
      {
        code: "15",
        name: "Kalender & Cloud",
        icon: CloudArrowUp,
        text: "Gemeinsamer Kalender, gemeinsame Ablage und persönliche Dateien – mit den Rechten der Einrichtung.",
        items: ["Kalender", "Gemeinsame Ablage", "Meine Dateien"],
      },
    ],
  },
  {
    id: "leitung",
    label: "Leitung",
    lead: "Steuern mit Zahlen, Regeln und einem vollständigen Protokoll.",
    modules: [
      {
        code: "16",
        name: "Dienstplan & Arbeitszeit",
        icon: CalendarDots,
        text: "Planen wie im PEP: Kürzel tippen, aus Excel einfügen, Musterwochen übertragen. Jede Änderung prüft die Regel-Engine.",
        items: ["Planung", "Anträge", "Arbeitszeit", "Einstellungen", "Protokoll"],
      },
      {
        code: "17",
        name: "Qualität & Kennzahlen",
        icon: ChartLineUp,
        text: "Qualitätsereignisse mit Massnahmen und Ablaufketten, Kennzahlen für Haus, Team und jede Person (Resident 360).",
        items: ["Ereignisse", "Massnahmen", "Kennzahlen", "Meine Kennzahlen"],
      },
      {
        code: "18",
        name: "Mitarbeitende & Rollen",
        icon: SealCheck,
        text: "Eigene Rollen je Einrichtung, Rechte kombiniert mit Qualifikationen – etwa für Medikation nur HF und FaGe.",
        items: ["Mitarbeitende", "Aufgaben", "Profile & Rollen", "Qualifikationen"],
      },
      {
        code: "19",
        name: "Administration",
        icon: GearSix,
        text: "Organisation, Wohnbereiche, Pflegebedarf, Portal-Zugänge, Sprachen, Löschfristen und CSV-Datenübernahme.",
        items: ["Organisation", "Pflegebedarf", "Konfiguration", "Portal", "Sprachen", "Datenübernahme"],
      },
    ],
  },
  {
    id: "ki",
    label: "CareCore KI",
    lead: "Entwürfe, die eine Fachperson prüft – nie mehr.",
    modules: [
      {
        code: "20",
        name: "Assistenz & KI-Entwürfe",
        icon: Brain,
        text: "Entwürfe für Übergabe, Dokumentation und Pflegeplanung. Übernommen wird erst nach Prüfung, einmal und protokolliert.",
        items: ["Assistenz", "KI-Entwürfe", "Dienstplan-KI"],
      },
    ],
  },
];

export const moduleCount = moduleGroups.reduce((sum, group) => sum + group.modules.length, 0);
