"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  type: string;
  qtyAvailable: number;
};

export default function NewRequestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState<number>(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const selected = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      const list = (data.products || []) as Product[];
      setProducts(list);
      if (list.length) setProductId(list[0].id);
    })();
  }, []);

  async function submit() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: note || null,
          items: [{ productId, qty }],
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "فشل إنشاء الطلب");
        return;
      }

      window.location.href = "/requests";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-md px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="text-sm text-white/70 hover:text-white">
            ← رجوع
          </a>
          <h1 className="text-lg font-semibold">طلب صرف جديد</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div>
            <label className="block text-sm text-white/80 mb-1">الصنف</label>
            <select
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2
                         focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500/50"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — المتاح: {p.qtyAvailable}
                </option>
              ))}
            </select>

            {selected && (
              <div className="text-xs text-white/55 mt-2">
                التصنيف: {selected.category} — النوع: {selected.type}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">الكمية</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2
                         focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500/50"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">ملاحظة (اختياري)</label>
            <textarea
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 min-h-[96px]
                         focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500/50"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: تركيب في واجهة المحل"
            />
          </div>

          {err && <div className="text-sm text-red-300">{err}</div>}

          <button
            onClick={submit}
            disabled={loading || !productId}
            className="w-full rounded-xl bg-white text-black py-2.5 font-semibold
                       disabled:opacity-60 active:scale-[0.99] transition"
          >
            {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </div>
    </div>
  );
}
