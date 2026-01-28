"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/ui/AppHeader";

type Stats = {
  approvedCount: number;
  pendingCount: number;
};

export default function DashboardPage() {
  const [name, setName] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ approvedCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // user
        const me = await fetch("/api/me", { credentials: "include" }).then((r) => r.json());
        setName(me?.name || me?.user?.name || null);
        // stats
        const st = await fetch("/api/stats", { credentials: "include" }).then((r) => r.json());
        if (st?.ok) setStats({ approvedCount: st.approvedCount ?? 0, pendingCount: st.pendingCount ?? 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader name={name} approvedCount={stats.approvedCount} />

      <main className="mx-auto w-full max-w-md px-4 py-5 space-y-4">
        {/* Banner */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-tr from-white/10 to-white/0 p-4">
          <div className="text-right">
            <div className="text-lg font-semibold">لوحة التحكم</div>
            <div className="text-sm text-white/60">
              {loading ? "جارٍ التحميل..." : `طلباتك قيد الانتظار: ${stats.pendingCount}`}
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 gap-3">
          <ServiceCard
            title="طلب صرف جديد"
            desc="حدد الصنف والكمية وأرسل الطلب"
            href="/requests/new"
          />
          <ServiceCard
            title="قائمة الطلبات"
            desc="تابع حالات طلباتك والطلبات المعتمدة"
            href="/requests"
          />
          <ServiceCard
            title="موافقات الأدمن"
            desc="اعتماد/رفض الطلبات (Admin فقط)"
            href="/admin/approvals"
          />
          <ServiceCard
            title="قريبًا: الأصناف والمخزون"
            desc="بحث + فلترة + تفاصيل الصنف"
            href="/products"
          />
        </div>
      </main>
    </div>
  );
}

function ServiceCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 block hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
          ➜
        </div>
        <div className="flex-1 text-right">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-white/60 mt-1">{desc}</div>
        </div>
      </div>
    </Link>
  );
}
