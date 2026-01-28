import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "STOREKEEPER") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const approved = await prisma.request.findMany({
    where: { status: "APPROVED" },
    orderBy: { approvedAt: "asc" },
    include: {
      createdBy: { select: { id: true, name: true, employeeNo: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, qtyAvailable: true } },
        },
      },
    },
  });

  return NextResponse.json({ ok: true, approved });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "STOREKEEPER") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const requestId = String(body?.requestId || "");
  if (!requestId) return NextResponse.json({ error: "bad request" }, { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) اجلب الطلب + عناصره
      const r = await tx.request.findUnique({
        where: { id: requestId },
        include: {
          items: true,
        },
      });

      if (!r) throw new Error("not found");
      if (r.status !== "APPROVED") throw new Error("request not approved");

      // 2) تحقق المخزون لكل عنصر
      for (const it of r.items) {
        const p = await tx.product.findUnique({
          where: { id: it.productId },
          select: { id: true, name: true, qtyAvailable: true },
        });

        if (!p) throw new Error("product not found");
        if (p.qtyAvailable < it.qty) {
          throw new Error(`insufficient stock: ${p.name} (available ${p.qtyAvailable}, need ${it.qty})`);
        }
      }

      // 3) خصم المخزون
      for (const it of r.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { qtyAvailable: { decrement: it.qty } },
        });
      }

      // 4) تحديث حالة الطلب → ISSUED
      const updated = await tx.request.update({
        where: { id: requestId },
        data: {
          status: "ISSUED",
          issuedAt: new Date(),
          // إذا عندك issuedById في schema فعّله:
          issuedById: user.userId,
        },
      });

      return updated;
    });

    return NextResponse.json({ ok: true, request: result });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "issue failed" }, { status: 400 });
  }
}
