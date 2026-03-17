"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/auth";
import { TopNav } from "@/components/TopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = getToken();
    if (!t) window.location.href = "/login";
    else setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="mx-auto max-w-6xl p-6">{children}</div>
    </div>
  );
}

