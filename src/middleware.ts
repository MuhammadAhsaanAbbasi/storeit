// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
} from "../routes/index";
import { createSessionClient } from "./lib/appwrite";
import { getCurrentUser } from "./lib/actions/user.actions";

const LOGIN_PATH = "/sign-in";

export default async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  // 1) Skip API auth routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return null;
  }

  // 2) Auth / Public checks
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = privateRoutes.includes(nextUrl.pathname);

  const response = NextResponse.next();

  // 3) Appwrite session cookie (supports both names)
  // const hasAppwriteCookie = Boolean(cookies.get("appwrite-session"));
  const user = await getCurrentUser();

  const isLoggedIn = !!user?.data;

  console.log("isLoggedIn", isLoggedIn);
  console.log("isAuthRoute", isAuthRoute);
  console.log("isProtectedRoute", isProtectedRoute);

  // 4) If logged in and visiting auth pages -> send to app
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }
    return null;
  }

  // 5) If NOT logged in and route is protected -> send to sign-in with a single safe callback
  if (!isLoggedIn && isProtectedRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // 6) Otherwise allow
  return response;
}

// Only allow same-origin paths and avoid loops to auth pages
function safeCallback(cb: string) {
  if (!cb || !cb.startsWith("/")) return "/";
  if (cb.startsWith("/sign-in") || cb.startsWith("/sign-up") || cb.startsWith("/error"))
    return "/";
  return cb;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
