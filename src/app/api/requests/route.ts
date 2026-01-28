import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";


///استعراض الطلبات 
type NewItem = { productId: string; qty: number };

function makeCode(n: number) {
  return `REQ-${String(n).padStart(5, "0")}`;
}

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // APPROVED | PENDING | REJECTED | ISSUED

  const where: any = {};

  // ✅ فلترة حسب الحالة إذا كانت موجودة
  if (status) {
    where.status = status;
  }

  // ✅ إذا كان WORKER يرى طلباته فقط
  if (user.role === "WORKER") {
    where.createdById = user.userId;
  }

  // ✅ إذا كان STOREKEEPER يرى فقط الطلبات المعتمدة أو المسلمة
  if (user.role === "STOREKEEPER") {
    where.status = status ?? "APPROVED";
  }

  const requests = await prisma.request.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true } },
      approvedBy: { select: { name: true } },
      issuedBy: { select: { name: true } },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json({ ok: true, requests });
}
//انشاء طلب جديد
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const note = body?.note?.toString() || null;

  const rawItems: any[] = Array.isArray(body?.items) ? body.items : [];

  const normalized: NewItem[] = rawItems
    .map((x: any): NewItem => ({
      productId: String(x?.productId ?? ""),
      qty: Number(x?.qty ?? 0),
    }))
    .filter((x) => x.productId.length > 0 && Number.isFinite(x.qty) && x.qty > 0);

  if (normalized.length === 0) {
    return NextResponse.json({ error: "invalid items" }, { status: 400 });
  }

  const count = await prisma.request.count();
  const code = makeCode(count + 1);

  const created = await prisma.request.create({
    data: {
      code,
      note,
      createdById: user.userId,
      items: {
        create: normalized.map((i) => ({
          productId: i.productId,
          qty: i.qty,
        })),
      },
    },
    include: {
      items: { include: { product: true } },
    },
  });

  return NextResponse.json({ ok: true, request: created });
}
