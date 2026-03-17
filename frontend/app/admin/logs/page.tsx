"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";
import { Card } from "@/components/Card";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [channel, setChannel] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const token = getToken()!;
      const q = new URLSearchParams();
      if (status) q.set("status", status);
      if (channel) q.set("channel", channel);
      const resp: any = await api.logs(token, `?${q.toString()}`);
      setLogs(resp.logs ?? []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.error?.message ?? "Failed to load logs");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Notification Logs</h1>
        <p className="text-sm text-white/60">Search delivery logs by status/channel.</p>
      </div>

      <Card title="Filters">
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Any status</option>
            <option value="SENT">SENT</option>
            <option value="FAILED">FAILED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
          <select
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">Any channel</option>
            <option value="email">email</option>
            <option value="sms">sms</option>
            <option value="push">push</option>
            <option value="inapp">inapp</option>
          </select>
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={load}
          >
            Search
          </button>
        </div>
        {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
      </Card>

      <Card title={`Results (${logs.length})`}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Notification</th>
                <th className="text-left py-2">Channel</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Retry</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="border-t border-white/10">
                  <td className="py-2 pr-3">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{l.notificationId}</td>
                  <td className="py-2 pr-3">{l.channel}</td>
                  <td className="py-2 pr-3">{l.status}</td>
                  <td className="py-2 pr-3">{l.retryCount}</td>
                </tr>
              ))}
              {logs.length === 0 ? (
                <tr>
                  <td className="py-3 text-white/60" colSpan={5}>
                    No logs found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

