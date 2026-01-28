import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth"; // عدّل الاسم حسب ملفك

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // إذا عندك role في user
  const isAdmin = user.role === "ADMIN";

  const approvedCount = isAdmin
    ? await prisma.request.count({ where: { status: "APPROVED" } })
    : await prisma.request.count({
        where: { createdById: user.userId, status: "APPROVED" },
      });

  const pendingCount = isAdmin
    ? await prisma.request.count({ where: { status: "PENDING" } })
    : await prisma.request.count({
        where: { createdById: user.userId, status: "PENDING" },
      });

  return NextResponse.json({
    ok: true,
    approvedCount,
    pendingCount,
  });
}
