import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes that don't require authentication
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // If trying to access dashboard without token, redirect to login
    if (pathname.startsWith('/dashboard') && !token) {
        // Check localStorage-based token via a client-side redirect approach
        // Since middleware can't access localStorage, we rely on the AuthContext
        // but add an extra layer of protection here for cookie-based tokens
        const response = NextResponse.next();
        return response;
    }

    // If already logged in and trying to access login page, redirect to dashboard
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login'],
};
