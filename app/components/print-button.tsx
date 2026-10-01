"use client";

import { Printer } from "@phosphor-icons/react";

export default function PrintButton() {
  return (
    <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
      <Printer size={18} /> Drucken / PDF
    </button>
  );
}
