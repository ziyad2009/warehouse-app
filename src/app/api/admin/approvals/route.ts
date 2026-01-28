import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const pending = await prisma.request.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      createdBy: true,
      items: { include: { product: true } },
    },
  });

  return NextResponse.json({ ok: true, pending });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const requestId = String(body?.requestId || "");
  const action = String(body?.action || ""); // "approve" | "reject"
  const rejectReason = body?.rejectReason?.toString() || null;

  if (!requestId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const current = await prisma.request.findUnique({ where: { id: requestId } });
  if (!current) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (current.status !== "PENDING") {
    return NextResponse.json({ error: "request is not pending" }, { status: 409 });
  }

  if (action === "reject") {
    const updated = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        rejectReason,
        approvedById: user.userId,
        approvedAt: new Date(),
      },
    });
    return NextResponse.json({ ok: true, request: updated });
  }

  // ✅ approve فقط بدون خصم مخزون
  const updated = await prisma.request.update({
    where: { id: requestId },
    data: {
      status: "APPROVED",
      approvedById: user.userId,
      approvedAt: new Date(),
      rejectReason: null,
    },
  });

  return NextResponse.json({ ok: true, request: updated });
}
