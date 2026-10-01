import "server-only";
import type { PoolClient } from "pg";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 3;

const allowed: Record<string, { mime: string; magic?: number[] }> = {
  pdf: { mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  png: { mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  jpg: { mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  jpeg: { mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  txt: { mime: "text/plain" },
  csv: { mime: "text/csv" },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", magic: [0x50, 0x4b, 0x03, 0x04] },
};

export type PreparedFile = { name: string; type: string; data: Buffer };

// Prüft Grösse, Endung und – wo möglich – den Inhalt. Gibt null zurück, wenn eine Datei nicht passt.
export async function prepareFiles(data: FormData, key = "files"): Promise<PreparedFile[] | null> {
  const files = data.getAll(key).filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return null;
  const prepared: PreparedFile[] = [];
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) return null;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const rule = allowed[ext];
    if (!rule) return null;
    const buffer = Buffer.from(await file.arrayBuffer());
    if (rule.magic && !rule.magic.every((byte, i) => buffer[i] === byte)) return null;
    const name = file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120) || `datei.${ext}`;
    prepared.push({ name, type: rule.mime, data: buffer });
  }
  return prepared;
}

export async function storeFiles(client: PoolClient, ticketId: string, messageId: string, files: PreparedFile[]) {
  for (const file of files) {
    await client.query(
      `insert into ticket_attachments (ticket_id, message_id, file_name, content_type, size_bytes, data)
       values ($1, $2, $3, $4, $5, $6)`,
      [ticketId, messageId, file.name, file.type, file.data.length, file.data],
    );
  }
}
