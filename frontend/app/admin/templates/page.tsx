"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";
import { Card } from "@/components/Card";

type Template = { _id: string; type: string; channel: string; templateBody: string; updatedAt: string };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [type, setType] = useState("ORDER_PLACED");
  const [channel, setChannel] = useState<"email" | "sms" | "push" | "inapp">("email");
  const [templateBody, setTemplateBody] = useState("Hello {{name}},\nYour order {{orderId}} has been placed successfully.");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const token = getToken()!;
      const resp: any = await api.templates(token);
      setTemplates(resp.templates ?? []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.error?.message ?? "Failed to load templates");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Template Management</h1>
        <p className="text-sm text-white/60">
          Templates are stored in MongoDB and rendered with {"{{variable}}"} replacement.
        </p>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}

      <Card title="Create / Update Template">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="type (e.g. ORDER_PLACED)"
          />
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={channel}
            onChange={(e) => setChannel(e.target.value as any)}
          >
            <option value="email">email</option>
            <option value="sms">sms</option>
            <option value="push">push</option>
            <option value="inapp">inapp</option>
          </select>
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={async () => {
              try {
                const token = getToken()!;
                await api.upsertTemplate(token, { type, channel, templateBody });
                await load();
              } catch (e: any) {
                setErr(e?.error?.message ?? "Failed to save template");
              }
            }}
          >
            Save
          </button>
        </div>
        <textarea
          className="mt-3 w-full min-h-40 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono"
          value={templateBody}
          onChange={(e) => setTemplateBody(e.target.value)}
        />
      </Card>

      <Card title={`Templates (${templates.length})`}>
        <div className="space-y-3">
          {templates.map((t) => (
            <div key={t._id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold">
                  {t.type} <span className="text-white/50">({t.channel})</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-white/15 px-3 py-1 text-sm hover:bg-white/5"
                    onClick={() => {
                      setType(t.type);
                      setChannel(t.channel as any);
                      setTemplateBody(t.templateBody);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-1 text-sm hover:bg-red-400/20"
                    onClick={async () => {
                      const token = getToken()!;
                      await api.deleteTemplate(token, t.type, t.channel);
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <pre className="mt-3 whitespace-pre-wrap text-xs text-white/70">{t.templateBody}</pre>
              <div className="mt-2 text-xs text-white/40">
                Updated: {new Date(t.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
          {templates.length === 0 ? <div className="text-sm text-white/60">No templates yet.</div> : null}
        </div>
      </Card>
    </div>
  );
}

