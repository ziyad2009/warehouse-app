"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Me = {
  name: string;
  role: "WORKER" | "ADMIN";
  approvedCount: number;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setMe(d))
      .catch(() => setMe(null));
  }, []);

  return (
    <div className="min-h-screen">
      <Topbar
        onMenu={() => setOpen(true)}
        userName={me?.name ?? "..."}
        role={me?.role ?? "WORKER"}
        approvedCount={me?.approvedCount ?? 0}
      />

      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 py-4">
          <Sidebar open={open} onClose={() => setOpen(false)} role={me?.role ?? "WORKER"} />
          <main className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
