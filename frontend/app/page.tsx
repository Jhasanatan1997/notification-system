import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-semibold">Notification Admin Dashboard</h1>
        <p className="mt-2 text-white/70">
          Login to manage templates, view logs, monitor queues/workers, and use AI tools.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400"
          >
            Login
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/5"
          >
            Go to Admin
          </Link>
        </div>
      </div>
    </main>
  );
}

