// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "../routes";

const LOGIN_PATH = "/sign-in";
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

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
  const sessionCookie =
    cookies.get(`a_session_${APPWRITE_PROJECT}`)?.value ??
    cookies.get(`a_session_${APPWRITE_PROJECT}_legacy`)?.value;

  const isLoggedIn = Boolean(sessionCookie);

  // 4) If logged in and visiting auth pages -> send to app
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return NextResponse.next();
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
  // official example with favicon/robots/sitemap excluded
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
