"use client";

import Link from "next/link";

type Props = {
  name?: string | null;
  approvedCount?: number;
};

export default function AppHeader({ name, approvedCount = 0 }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="mx-auto w-full max-w-md px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Link
            href="/api/auth/logout"
            className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-sm"
          >
            خروج
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/20 px-3 py-1 text-sm">
            الموافق عليها: {approvedCount}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-white/80">مرحبًا</div>
            <div className="text-sm font-semibold">{name || "—"}</div>
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center"
            aria-label="menu"
            onClick={() => alert("قائمة لاحقًا (Sidebar/Menu)")}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
