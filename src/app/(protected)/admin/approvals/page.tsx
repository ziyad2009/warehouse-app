"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  qty: number;
  product: { name: string };
};

type Req = {
  id: string;
  code: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  note: string | null;
  createdAt: string;
  createdBy: { name: string };
  items: Item[];
};

function statusBadge(status: Req["status"]) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold border";

  if (status === "APPROVED")
    return `${base} bg-emerald-500/15 text-emerald-300 border-emerald-500/30`;

  if (status === "REJECTED")
    return `${base} bg-red-500/15 text-red-300 border-red-500/30`;

  return `${base} bg-orange-500/15 text-orange-300 border-orange-500/30`;
}

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch("/api/admin/approvals", {
      credentials: "include",
    });

    if (!res.ok) {
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setRequests(data.pending || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function action(id: string, type: "approve" | "reject") {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id,
          action: type,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "خطأ في العملية");
        return;
      }

      await load(); // تحديث القائمة
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-white/70 hover:text-white">
            ← رجوع
          </a>
          <h1 className="text-lg font-semibold">موافقات الأدمن</h1>
        </div>

        {/* Refresh */}
        <button
          onClick={load}
          className="w-full rounded-xl bg-white/10 border border-white/10 py-2 text-sm"
        >
          تحديث القائمة
        </button>

        {err && <div className="text-sm text-red-300">{err}</div>}

        {/* Requests */}
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className={statusBadge(r.status)}>{r.status}</div>
                <div className="font-semibold">{r.code}</div>
              </div>

              <div className="text-sm text-white/70">
                الموظف: <span className="text-white">{r.createdBy.name}</span>
              </div>

              {r.note && (
                <div className="text-sm text-white/60">📝 {r.note}</div>
              )}

              <div className="mt-2 text-sm">
                <div className="font-semibold mb-1">العناصر:</div>
                <ul className="space-y-1">
                  {r.items.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center justify-between text-white/80"
                    >
                      <span>{it.product.name}</span>
                      <span>× {it.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              {r.status === "PENDING" && (
                <div className="flex gap-2 pt-2">
                  <button
                    disabled={loading}
                    onClick={() => action(r.id, "approve")}
                    className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    موافقة
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => action(r.id, "reject")}
                    className="flex-1 rounded-xl bg-red-600 text-white py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    رفض
                  </button>
                </div>
              )}
            </div>
          ))}

          {requests.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              لا توجد طلبات قيد الموافقة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
