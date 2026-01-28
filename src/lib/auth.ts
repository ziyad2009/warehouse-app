import { cookies } from "next/headers";

export type SessionUser = {
  userId: string;
  role: "WORKER" | "ADMIN" | "STOREKEEPER";
  name: string;
  username: string;
};

const COOKIE_NAME = "warehouse_session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionUser(user: SessionUser) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, encodeURIComponent(JSON.stringify(user)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const jar = await cookies();

  // ✅ طريقة الحذف الأفضل
  jar.delete(COOKIE_NAME);

  // ✅ احتياط: overwrite مع maxAge=0 (بعض البيئات تحتاجها)
  jar.set(COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });
}
