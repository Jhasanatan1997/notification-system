"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { setToken } from "@/utils/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@local.dev");
  const [password, setPassword] = useState("admin12345");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-white/60 text-sm">JWT-based login for the Admin Dashboard.</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
          />
          {error ? <div className="text-sm text-red-300">{error}</div> : null}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                const resp = await api.login(email, password);
                setToken(resp.token);
                window.location.href = "/admin";
              } catch (e: any) {
                setError(e?.error?.message ?? "Login failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </main>
  );
}

