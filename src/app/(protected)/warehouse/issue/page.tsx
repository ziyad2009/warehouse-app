"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  qty: number;
  product: { name: string; qtyAvailable: number };
};

type Req = {
  id: string;
  code: string;
  status: "APPROVED";
  note: string | null;
  approvedAt: string | null;
  createdBy: { name: string };
  items: Item[];
};

export default function WarehouseIssuePage() {
  const [list, setList] = useState<Req[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch("/api/warehouse/issue", { credentials: "include" });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      window.location.href = "/login";
      return;
    }

    setList(data.approved || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function issue(requestId: string) {
    setLoadingId(requestId);
    try {
      const res = await fetch("/api/warehouse/issue", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "فشل التسليم");
        return;
      }

      await load(); // تحديث القائمة بعد التسليم
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-white/70 hover:text-white">
            ← رجوع
          </a>
          <h1 className="text-lg font-semibold">تسليم الطلبات (المستودع)</h1>
        </div>

        <button
          onClick={load}
          className="w-full rounded-xl bg-white/10 border border-white/10 py-2 text-sm"
        >
          تحديث
        </button>

        {err && <div className="text-sm text-red-300">{err}</div>}

        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                  APPROVED
                </span>
                <div className="font-semibold">{r.code}</div>
              </div>

              <div className="text-sm text-white/70">
                الموظف: <span className="text-white">{r.createdBy.name}</span>
              </div>

              {r.note && <div className="text-sm text-white/60">📝 {r.note}</div>}

              <div className="mt-2 text-sm">
                <div className="font-semibold mb-1">العناصر</div>
                <ul className="space-y-1">
                  {r.items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between text-white/80">
                      <span>{it.product.name}</span>
                      <span>× {it.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={loadingId === r.id}
                onClick={() => issue(r.id)}
                className="w-full rounded-xl bg-white text-black py-2.5 font-semibold disabled:opacity-60"
              >
                {loadingId === r.id ? "جارٍ تنفيذ السحب..." : "تنفيذ السحب / تسليم الطلب"}
              </button>
            </div>
          ))}

          {list.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              لا توجد طلبات موافق عليها للتسليم.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
