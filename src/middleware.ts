// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "@/lib/routes";

const LOGIN_PATH = "/sign-in";

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  // 1) Skip API auth routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next(); // <- not null
  }

  // 2) Route checks
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // treat entries like "/dashboard" as prefixes
  const isProtectedRoute = privateRoutes.some(
    (base) =>
      nextUrl.pathname === base || nextUrl.pathname.startsWith(`${base}/`)
  );

  const res = NextResponse.next();

  // 3) Correct Appwrite cookie names
  const sessionCookie = Boolean(cookies.get("appwrite-session"));

  const isLoggedIn = !!sessionCookie;

  // 4) If logged in and visiting auth pages -> send to app
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return null;
  }

  // 5) If not logged in and protected -> sign-in with safe callback
  if (!isLoggedIn && isProtectedRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const url = new URL(LOGIN_PATH, req.url);
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }

  // 6) Otherwise allow
  return res;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
