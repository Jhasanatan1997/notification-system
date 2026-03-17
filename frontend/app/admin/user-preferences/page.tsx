"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";

export default function UserPreferencesPage() {
  const [userId, setUserId] = useState("");
  const [prefs, setPrefs] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const [notificationType, setNotificationType] = useState("ORDER_PLACED");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">User Preferences</h1>
        <p className="text-sm text-white/60">Admin tooling to view/update a user’s notification preferences.</p>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}

      <Card title="Load user preferences">
        <div className="flex flex-wrap gap-3">
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="userId"
          />
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={async () => {
              try {
                const token = getToken()!;
                const resp: any = await api.userPrefs(token, userId);
                setPrefs(resp.preferences ?? []);
                setErr(null);
              } catch (e: any) {
                setErr(e?.error?.message ?? "Failed to load");
              }
            }}
          >
            Load
          </button>
        </div>
      </Card>

      <Card title="Upsert preference">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm"
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            placeholder="notificationType"
          />
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
              email
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />
              sms
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
              push
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={inAppEnabled} onChange={(e) => setInAppEnabled(e.target.checked)} />
              inapp
            </label>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <button
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
            onClick={async () => {
              try {
                const token = getToken()!;
                await api.upsertUserPref(token, userId, {
                  notificationType,
                  emailEnabled,
                  smsEnabled,
                  pushEnabled,
                  inAppEnabled,
                });
                const resp: any = await api.userPrefs(token, userId);
                setPrefs(resp.preferences ?? []);
                setErr(null);
              } catch (e: any) {
                setErr(e?.error?.message ?? "Failed to save");
              }
            }}
          >
            Save
          </button>
        </div>
      </Card>

      <Card title={`Current (${prefs.length})`}>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-white/60">
              <tr>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">email</th>
                <th className="text-left py-2">sms</th>
                <th className="text-left py-2">push</th>
                <th className="text-left py-2">inapp</th>
              </tr>
            </thead>
            <tbody>
              {prefs.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="py-2 pr-3">{p.notificationType}</td>
                  <td className="py-2 pr-3">{String(p.emailEnabled)}</td>
                  <td className="py-2 pr-3">{String(p.smsEnabled)}</td>
                  <td className="py-2 pr-3">{String(p.pushEnabled)}</td>
                  <td className="py-2 pr-3">{String(p.inAppEnabled)}</td>
                </tr>
              ))}
              {prefs.length === 0 ? (
                <tr>
                  <td className="py-3 text-white/60" colSpan={5}>
                    No preferences found.
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

