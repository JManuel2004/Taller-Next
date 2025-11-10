import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const protectedRoutes = ['/dashboard', '/projects', '/tasks', '/users'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isPublicRoute && token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      
      if (payload.role === 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }
    } catch (error) {
      console.error('Error decodificando token:', error);
    }
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isProtectedRoute) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      if (
        (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/users')) &&
        payload.role !== 'superadmin'
      ) {
        return NextResponse.redirect(new URL('/dashboard/user', request.url));
      }

      if (pathname.startsWith('/dashboard/user') && payload.role === 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      }
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/') {
    if (token) {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split('.')[1], 'base64').toString()
        );
        
        if (payload.role === 'superadmin') {
          return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/dashboard/user', request.url));
        }
      } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
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
