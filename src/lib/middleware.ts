import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "warehouse_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
// المسارات التي نعتبرها محمية
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/requests") ||
    pathname.startsWith("/admin");

  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    try {
      const s = JSON.parse(session) as { role?: string };
      if (s.role !== "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/requests/:path*", "/admin/:path*"],
};
