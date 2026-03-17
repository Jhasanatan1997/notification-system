"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { api } from "@/services/api";
import { getToken } from "@/utils/auth";

export default function MetricsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken()!;
        setOverview(await api.overview(token));
      } catch (e: any) {
        setErr(e?.error?.message ?? "Failed to load");
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">System Metrics</h1>
        <p className="text-sm text-white/60">Queue statistics + totals. (Extendable to Prometheus later.)</p>
      </div>

      {err ? <div className="text-sm text-red-300">{err}</div> : null}

      <Card title="Raw JSON">
        <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-3 text-xs">
          {JSON.stringify(overview, null, 2)}
        </pre>
      </Card>
    </div>
  );
}

