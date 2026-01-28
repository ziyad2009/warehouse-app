import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
    req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // فعّلها لما تضيف الدور STOREKEEPER في schema + auth types
  // if (user.role !== "STOREKEEPER") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  
  // (اختياري) قراءة body
  // const body = await req.json().catch(() => null);
  const {id} = await params;

  const result = await prisma.$transaction(async (tx) => {
    const reqRow = await tx.request.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!reqRow) throw new Error("NOT_FOUND");
    if (reqRow.status !== "APPROVED") throw new Error("NOT_APPROVED");

    // تحقق مخزون ثم خصم
    for (const item of reqRow.items) {
      const p = await tx.product.findUnique({ where: { id: item.productId } });
      if (!p) throw new Error("PRODUCT_NOT_FOUND");
      if (p.qtyAvailable < item.qty) throw new Error("INSUFFICIENT_STOCK");
    }

    for (const item of reqRow.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { qtyAvailable: { decrement: item.qty } },
      });
    }

    const updated = await tx.request.update({
      where: { id },
      data: {
        status: "ISSUED",
        issuedAt: new Date(),
        issuedById: user.userId, // إذا أضفتها في schema
      },
      include: { items: { include: { product: true } } },
    });

    return updated;
  });

  return NextResponse.json({ ok: true, request: result });
}
