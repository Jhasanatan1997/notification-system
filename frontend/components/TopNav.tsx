import Link from "next/link";
import { clearToken } from "@/utils/auth";

export function TopNav() {
  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="text-sm font-semibold">
          Notification Admin
        </Link>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <Link href="/admin/logs" className="hover:text-white">
            Logs
          </Link>
          <Link href="/admin/templates" className="hover:text-white">
            Templates
          </Link>
          <Link href="/admin/test-send" className="hover:text-white">
            Test Send
          </Link>
          <Link href="/admin/user-preferences" className="hover:text-white">
            Preferences
          </Link>
          <Link href="/admin/metrics" className="hover:text-white">
            Metrics
          </Link>
          <button
            className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/5"
            onClick={() => {
              clearToken();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

