"use client";

import { Alert, Button, Input, Popconfirm } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteRecord, saveRecord, type Result } from "@/lib/admin/actions";
import type { Field, Section } from "@/lib/admin/sections";
import { shrinkImage } from "./shrinkImage";

type Choice = { id: string; label: string };
type Props = {
  sectionKey: string;
  section: Section;
  id: string | null;
  record: Record<string, unknown>;
  events: Choice[];
  sponsors: Choice[];
  chosenSponsors: string[];
  imageUrl?: string;
  saved?: boolean;
};

export default function RecordForm({ sectionKey, section, id, record, events, sponsors, chosenSponsors, imageUrl, saved }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(saved ? { ok: record.status === "draft" ? "Saved as a draft." : record.status ? "Published." : "Saved." } : {});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    setBusy(true);
    setResult({});
    try {
      for (const field of section.fields.filter((f) => f.type === "image")) {
        const file = form.get(field.name);
        if (file instanceof File && file.size > 0) form.set(field.name, await shrinkImage(file));
        else form.delete(field.name);
      }
      const response = await saveRecord(sectionKey, id, form);
      if (response.id && !response.error && !id) router.replace(`/admin/${sectionKey}/${response.id}?saved=1`);
      else {
        setResult(response);
        if (response.id && !id) router.replace(`/admin/${sectionKey}/${response.id}`);
        else router.refresh();
      }
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    const response = await deleteRecord(sectionKey, id!);
    if (response.error) { setResult(response); setBusy(false); }
    else router.replace(`/admin/${sectionKey}`);
  }

  const value = (name: string) => String(record[name] ?? "");

  function control(field: Field) {
    const common = { name: field.name, id: field.name, required: field.required };
    switch (field.type) {
      case "textarea":
        return <Input.TextArea {...common} defaultValue={value(field.name)} maxLength={field.max} autoSize={{ minRows: 3, maxRows: 16 }} />;
      case "select":
        return (
          <select {...common} defaultValue={value(field.name) || field.options?.[0]}>
            {field.options?.map((o) => <option key={o}>{o}</option>)}
          </select>
        );
      case "event":
        return (
          <select {...common} defaultValue={value(field.name)}>
            <option value="">No event</option>
            {events.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        );
      case "sponsors":
        return sponsors.length ? (
          <div className="admin-checks">
            {sponsors.map((o) => (
              <label key={o.id}><input type="checkbox" name="sponsors" value={o.id} defaultChecked={chosenSponsors.includes(o.id)} /> {o.label}</label>
            ))}
          </div>
        ) : <p>Add sponsors first.</p>;
      case "image":
        return (
          <>
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Current upload" className="admin-thumb" />
            )}
            <input type="file" name={field.name} id={field.name} accept="image/jpeg,image/png,image/webp" required={field.required && !imageUrl} />
          </>
        );
      default:
        return (
          <Input {...common} defaultValue={value(field.name) || (field.type === "number" ? "0" : "")} maxLength={field.max}
            type={field.type === "date" || field.type === "number" || field.type === "email" ? field.type : field.type === "url" ? "url" : "text"} />
        );
    }
  }

  return (
    <form onSubmit={submit} className="admin-form">
      {section.fields.map((field) => (
        <div key={field.name} className="admin-field">
          {field.type === "sponsors" ? <span>{field.label}</span> : <label htmlFor={field.name}>{field.label}{field.required && " (required)"}</label>}
          {control(field)}
          {field.help && <small>{field.help}</small>}
        </div>
      ))}
      <div aria-live="polite">
        {busy && <p>Saving…</p>}
        {result.error && <Alert type="error" showIcon title={result.error} />}
        {result.ok && <Alert type="success" showIcon title={result.ok} />}
      </div>
      <div className="actions">
        {section.hasStatus ? (
          <>
            <Button type="primary" htmlType="submit" name="status" value="published" disabled={busy}>Publish</Button>
            <Button htmlType="submit" name="status" value="draft" disabled={busy}>
              {record.status === "published" ? "Unpublish and save as draft" : "Save draft"}
            </Button>
          </>
        ) : <Button type="primary" htmlType="submit" disabled={busy}>Save</Button>}
        {id && section.preview && <Link href={`/admin/preview/${sectionKey}/${id}`}>Preview last saved version</Link>}
        {id && section.hasStatus && (
          <Popconfirm title={`Delete this ${section.singular}?`} description="This cannot be undone." okText="Delete" okButtonProps={{ danger: true }} onConfirm={remove}>
            <Button danger disabled={busy}>Delete</Button>
          </Popconfirm>
        )}
      </div>
    </form>
  );
}
