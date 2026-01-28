import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = body?.username?.toString().trim();
  const password = body?.password?.toString();

  if (!username || !password) {
    return NextResponse.json({ error: "missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  // مبدئياً (Plain password) — لاحقاً نعمل Hash
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  await setSessionUser({
    userId: user.id,
    role: user.role,
    name: user.name,
    username: user.username,
  });

  return NextResponse.json({ ok: true, role: user.role });
}
