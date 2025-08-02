// middleware.js
import { NextRequest, NextResponse } from 'next/server';
import { createSessionClient } from './lib/appwrite';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, privateRoutes } from '../routes';

export async function middleware(req: NextRequest) {
    const { nextUrl } = req;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    const isLoggedIn = true;

    if (isApiAuthRoute) {
        // Do nothing for API auth routes
        return;
    }

    // Redirect logged-in users away from /sign-in or /sign-up
    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url));
    }

    // Redirect unauthenticated users to /sign-in
    if (!isLoggedIn && isPrivateRoute) {
        const callback = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(
            new URL(`/sign-in?callbackUrl=${callback}`, req.url)
        );
    }

    // Allow access to public routes or logged-in users
    return;
}

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|favicon.ico).*)',
    ],
}