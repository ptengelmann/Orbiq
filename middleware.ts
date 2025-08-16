// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasSessionCookie(req: NextRequest) {
  const c = req.cookies;
  return (
    c.has("next-auth.session-token") ||
    c.has("__Secure-next-auth.session-token")
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/dashboard")) {
    if (!hasSessionCookie(req)) {
      const url = new URL("/auth/sign-in", req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
