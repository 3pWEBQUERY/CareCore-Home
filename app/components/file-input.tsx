export default function FileInput() {
  return (
    <label className="field">
      <span>Anhänge (optional)</span>
      <input type="file" name="files" multiple accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.docx,.xlsx" />
      <small className="field-hint">Bis zu 3 Dateien, je max. 5 MB – PDF, Bilder, TXT, CSV, Word oder Excel.</small>
    </label>
  );
}
