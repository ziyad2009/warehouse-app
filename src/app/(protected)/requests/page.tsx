"use client";

import { useEffect, useState } from "react";

type RequestItem = {
  id: string;
  qty: number;
  product: { name: string };
};

type Req = {
  id: string;
  code: string;
  status: string;
  note: string | null;
  createdAt: string;
  items: RequestItem[];
};

function statusBadge(status: string) {
  const base = "px-3 py-1 rounded-full text-xs border";
  if (status === "APPROVED") return `${base} bg-emerald-500/15 text-emerald-200 border-emerald-400/20`;
  if (status === "REJECTED") return `${base} bg-red-500/15 text-red-200 border-red-400/20`;
  return `${base} bg-white/10 text-white/80 border-white/10`;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch("/api/requests", { credentials: "include" });
    if (!res.ok) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    setRequests(data.requests || []);
  }

  useEffect(() => {
    load().catch((e) => setErr(String(e)));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-white/70 hover:text-white">
            ← رجوع
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/requests/new"
              className="rounded-xl bg-white text-black px-3 py-2 text-sm font-semibold"
            >
              + طلب جديد
            </a>
            <button
              onClick={load}
              className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm"
            >
              تحديث
            </button>
          </div>
        </div>

        <h1 className="text-lg font-semibold">قائمة الطلبات</h1>

        {err && <div className="text-sm text-red-300">{err}</div>}

        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className={statusBadge(r.status)}>{r.status}</div>
                <div className="font-semibold">{r.code}</div>
              </div>

              {r.note && <div className="text-sm text-white/70 mt-2">{r.note}</div>}

              <div className="mt-3 text-sm text-white/80">
                <div className="font-semibold mb-1">العناصر</div>
                <ul className="space-y-1">
                  {r.items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between">
                      <span className="text-white/90">{it.product.name}</span>
                      <span className="text-white/70">× {it.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              لا توجد طلبات بعد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
