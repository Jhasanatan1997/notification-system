"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";

export default function TestSendPage() {
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("ORDER_PLACED");
  const [channels, setChannels] = useState("email,push");
  const [dataJson, setDataJson] = useState('{"orderId":"456"}');
  const [scheduledAt, setScheduledAt] = useState("");
  const [aiInput, setAiInput] = useState("order shipped");
  const [aiOut, setAiOut] = useState<string>("");
  const [spamOut, setSpamOut] = useState<string>("");
  const [engOut, setEngOut] = useState<string>("");
  const [resp, setResp] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Send Test Notification</h1>
        <p className="text-sm text-white/60">Trigger notifications and use AI tools for message quality checks.</p>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}

      <Card title="AI Tools (Admin-only)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="e.g. order shipped"
          />
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={async () => {
              const token = getToken()!;
              const r: any = await api.aiGenerate(token, { input: aiInput, channel: "push" });
              setAiOut(r.message);
            }}
          >
            Generate Message
          </button>
          <button
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
            onClick={async () => {
              const token = getToken()!;
              const r: any = await api.aiSpam(token, { message: aiOut || aiInput, recentPerMinute: 0 });
              setSpamOut(`${r.isSpam ? "SPAM" : "OK"} — ${r.reason}`);
            }}
          >
            Detect Spam
          </button>
          <button
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5 md:col-span-3"
            onClick={async () => {
              const token = getToken()!;
              const r: any = await api.aiEngagement(token, { message: aiOut || aiInput, channel: "push" });
              setEngOut(`Engagement score: ${r.score}`);
            }}
          >
            Predict Engagement
          </button>
        </div>
        <div className="mt-3 text-sm text-white/70 space-y-1">
          <div>
            <span className="text-white/50">AI message:</span> {aiOut || "—"}
          </div>
          <div>
            <span className="text-white/50">Spam:</span> {spamOut || "—"}
          </div>
          <div>
            <span className="text-white/50">Engagement:</span> {engOut || "—"}
          </div>
        </div>
      </Card>

      <Card title="POST /notifications">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="userId (Mongo ObjectId)"
          />
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="type"
          />
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
            placeholder="channels (comma separated)"
          />
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            placeholder='scheduledAt ISO (optional) e.g. 2026-03-17T09:00:00.000Z'
          />
        </div>
        <textarea
          className="mt-3 w-full min-h-28 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-mono"
          value={dataJson}
          onChange={(e) => setDataJson(e.target.value)}
        />
        <div className="mt-3 flex gap-3">
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={async () => {
              setErr(null);
              setResp(null);
              try {
                const data = JSON.parse(dataJson);
                const body = {
                  userId,
                  type,
                  channels: channels
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  data,
                  ...(scheduledAt ? { scheduledAt } : {}),
                };
                setResp(await api.sendTest(body));
              } catch (e: any) {
                setErr(e?.error?.message ?? e?.message ?? "Failed");
              }
            }}
          >
            Send
          </button>
        </div>
        {resp ? (
          <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-3 text-xs">
            {JSON.stringify(resp, null, 2)}
          </pre>
        ) : null}
      </Card>
    </div>
  );
}

