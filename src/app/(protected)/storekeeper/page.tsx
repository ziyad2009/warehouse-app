"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ISSUED";

type RequestRow = {
  id: string;
  code: string;
  status: RequestStatus;
  note?: string | null;
  createdAt?: string;
  createdBy?: { name: string; username?: string };
  items?: Array<{
    id: string;
    qty: number;
    product?: { id: string; name: string };
  }>;
};

function statusBadge(status: RequestStatus) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border";
  switch (status) {
    case "APPROVED":
      return `${base} bg-green-500/15 text-green-300 border-green-500/30`;
    case "REJECTED":
      return `${base} bg-red-500/15 text-red-300 border-red-500/30`;
    case "PENDING":
      return `${base} bg-orange-500/15 text-orange-300 border-orange-500/30`;
    case "ISSUED":
      return `${base} bg-blue-500/15 text-blue-300 border-blue-500/30`;
    default:
      return `${base} bg-white/10 text-white/80 border-white/10`;
  }
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export default function StorekeeperPage() {
  const [loading, setLoading] = useState(true);
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RequestRow[]>([]);

  // ✅ هنا نجيب الطلبات المعتمدة فقط
  // إذا API عندك مختلف، غيّر المسار هنا فقط
  const fetchApproved = async () => {
    setLoading(true);
    setError(null);
    try {
      // خيار 1: إذا عندك فلترة جاهزة
      const res = await fetch("/api/requests?status=APPROVED", {
        cache: "no-store",
      });

      // خيار 2 (بديل): إذا /api/requests يرجع كل شيء، بنفلتر هنا
      const data = await safeJson(res);
      if (!res.ok) {
        setRows([]);
        setError(data?.error || "تعذر جلب الطلبات");
        return;
      }

      const list: RequestRow[] = data?.requests ?? data ?? [];
      const approved = (Array.isArray(list) ? list : []).filter(
        (r) => r.status === "APPROVED"
      );

      setRows(approved);
    } catch (e: any) {
      setError(e?.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  const totalApproved = rows.length;

  const handleIssue = async (id: string) => {
    setIssuingId(id);
    setError(null);

    try {
      // ✅ هذا API التسليم بنسويه لاحقًا:
      // POST /api/issue/[requestId]
      const res = await fetch(`/api/issue/${id}`, { method: "POST" });
      const data = await safeJson(res);

      if (!res.ok) {
        setError(data?.error || "فشل تنفيذ التسليم");
        return;
      }

      // تحديث الواجهة فوراً: حذف الطلب من القائمة لأنه صار ISSUED
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      setError(e?.message || "خطأ غير متوقع أثناء التسليم");
    } finally {
      setIssuingId(null);
    }
  };

  const emptyState = useMemo(() => !loading && rows.length === 0, [loading, rows]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold">تسليم الطلبات</h1>
              <p className="text-xs text-white/60">
                الطلبات المعتمدة الجاهزة للتسليم وخصم المخزون
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                المعتمدة: <span className="font-semibold text-white">{totalApproved}</span>
              </span>

              <button
                onClick={fetchApproved}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                تحديث
              </button>

              <Link
                href="/dashboard"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                رجوع
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-4 py-5">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="mt-3 h-3 w-48 rounded bg-white/10" />
                <div className="mt-4 h-9 w-28 rounded-xl bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {emptyState && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm text-white/80">لا توجد طلبات معتمدة للتسليم الآن.</p>
            <button
              onClick={fetchApproved}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90"
            >
              إعادة تحميل
            </button>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="space-y-3">
            {rows.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{r.code}</span>
                      <span className={statusBadge(r.status)}>{r.status}</span>
                    </div>

                    <div className="mt-1 text-xs text-white/70">
                      مقدم الطلب:{" "}
                      <span className="text-white/90">
                        {r.createdBy?.name || r.createdBy?.username || "—"}
                      </span>
                    </div>

                    {r.note && (
                      <div className="mt-2 text-xs text-white/70">
                        ملاحظة: <span className="text-white/90">{r.note}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleIssue(r.id)}
                    disabled={issuingId === r.id}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-white/90 disabled:opacity-60"
                  >
                    {issuingId === r.id ? "جارٍ التسليم..." : "تسليم"}
                  </button>
                </div>

                {/* Items */}
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 text-xs font-semibold text-white/80">
                    الأصناف
                  </div>
                  <div className="space-y-2">
                    {(r.items || []).map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <div className="text-xs text-white/90">
                          {it.product?.name || it.product?.id || "—"}
                        </div>
                        <div className="text-xs text-white/70">
                          الكمية:{" "}
                          <span className="font-semibold text-white">{it.qty}</span>
                        </div>
                      </div>
                    ))}
                    {(r.items || []).length === 0 && (
                      <div className="text-xs text-white/60">لا توجد أصناف.</div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-white/50">
                  المعرف: {r.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
