"use client";

import { Alert, Button, Input } from "antd";
import { useState } from "react";
import { saveRecord } from "@/lib/admin/actions";
import { shrinkImage } from "./shrinkImage";

export default function BulkUpload({ events }: { events: { id: string; label: string }[] }) {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ ok: boolean; text: string }[]>([]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const element = e.currentTarget;
    const form = new FormData(element, (e.nativeEvent as SubmitEvent).submitter);
    const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    setBusy(true);
    setLog([]);
    let failures = 0;
    for (const [i, file] of files.entries()) {
      try {
        const one = new FormData();
        one.set("storage_path", await shrinkImage(file));
        one.set("alt_text", `${String(form.get("alt_text")).trim()} (${i + 1})`);
        one.set("event_id", String(form.get("event_id")));
        one.set("sort_order", String(i + 1));
        one.set("status", String(form.get("status")));
        const response = await saveRecord("photos", null, one);
        if (response.error) throw new Error(`${file.name}: ${response.error}`);
        setLog((l) => [...l, { ok: true, text: `${file.name}: uploaded` }]);
      } catch (error) {
        failures++;
        setLog((l) => [...l, { ok: false, text: error instanceof Error ? error.message : `${file.name}: upload failed` }]);
      }
    }
    if (!failures) element.reset();
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="admin-form">
      <div className="admin-field"><label htmlFor="files">Photos (5 MB or less each)</label>
        <input id="files" type="file" name="files" multiple required accept="image/jpeg,image/png,image/webp" /></div>
      <div className="admin-field"><label htmlFor="alt">Shared description (a number is added to each)</label>
        <Input id="alt" name="alt_text" required maxLength={180} /></div>
      <div className="admin-field"><label htmlFor="ev">Event</label>
        <select id="ev" name="event_id"><option value="">No event</option>{events.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></div>
      <label><input type="checkbox" required /> I have permission to publish these photos, including guardian consent for children.</label>
      <div className="actions">
        <Button type="primary" htmlType="submit" name="status" value="published" disabled={busy}>Upload and publish</Button>
        <Button htmlType="submit" name="status" value="draft" disabled={busy}>Upload as drafts</Button>
      </div>
      <div aria-live="polite" className="admin-form">{busy && <p>Uploading…</p>}{log.map((l, i) => <Alert key={i} type={l.ok ? "success" : "error"} title={l.text} />)}</div>
    </form>
  );
}
