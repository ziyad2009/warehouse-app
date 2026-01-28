import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminApprovalsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const pending = await prisma.request.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      createdBy: { select: { name: true, employeeNo: true, username: true } },
    },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold">موافقات الأدمن</h1>
      <p className="text-sm text-gray-400 mt-1">اعتماد أو رفض الطلبات الجديدة.</p>

      <div className="mt-4 space-y-3">
        {pending.map((r) => (
          <div key={r.id} className="border border-white/10 rounded-2xl p-4 bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{r.code}</div>
                <div className="text-sm text-white/60">
                  {new Date(r.createdAt).toLocaleString("ar-SA")} — عناصر: {r.items.length}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  مقدم الطلب: {r.createdBy?.name} ({r.createdBy?.employeeNo})
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[260px]">
                <form action="/api/admin/approvals" method="POST" className="flex gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="action" value="approve" />
                  <button className="w-full px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                    موافقة
                  </button>
                </form>

                <form action="/api/admin/approvals" method="POST" className="flex gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="action" value="reject" />
                  <input
                    name="reason"
                    placeholder="سبب الرفض"
                    className="flex-1 border border-white/10 bg-black/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40"
                  />
                  <button className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700">
                    رفض
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <div className="border border-white/10 rounded-2xl p-4 text-white/70 bg-white/5">
            لا يوجد طلبات بانتظار الموافقة.
          </div>
        )}
      </div>
    </div>
  );
}
