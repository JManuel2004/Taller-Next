import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { JWTPayload } from '@/types';

function decodeJwt(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token =
    request.cookies.get('token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const protectedRoutes = ['/dashboard', '/projects', '/tasks', '/users'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute && token) {
    const payload = decodeJwt(token);
    if (payload) {
      if (payload.role === 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }
    }
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isProtectedRoute) {
    const payload = decodeJwt(token);

    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (
      (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/users')) &&
      payload.role !== 'superadmin'
    ) {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }

    if (pathname.startsWith('/dashboard/user') && payload.role === 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  if (pathname === '/') {
    if (token) {
      const payload = decodeJwt(token);
      if (payload) {
        if (payload.role === 'superadmin') {
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard/user', request.url));
        }
      }
      return NextResponse.redirect(new URL('/login', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
