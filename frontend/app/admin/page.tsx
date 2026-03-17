"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";
import { Card } from "@/components/Card";

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken()!;
        setData(await api.overview(token));
      } catch (e: any) {
        setErr(e?.error?.message ?? "Failed to load");
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-white/60">High-level notification and queue stats.</p>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total">{data?.totals?.total ?? "—"}</Card>
        <Card title="Sent">{data?.totals?.sent ?? "—"}</Card>
        <Card title="Failed">{data?.totals?.failed ?? "—"}</Card>
        <Card title="Queued">{data?.totals?.queued ?? "—"}</Card>
      </div>

      <Card title="Queue">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          {["waiting", "active", "delayed", "completed", "failed"].map((k) => (
            <div key={k} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">{k}</div>
              <div className="text-lg font-semibold">{data?.queue?.[k] ?? "—"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

