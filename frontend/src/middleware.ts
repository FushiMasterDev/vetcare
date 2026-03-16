import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/booking', '/appointments', '/profile', '/admin'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // If accessing auth pages while logged in, redirect to home
  if (authRoutes.some(r => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing protected routes without token, redirect to login
  if (protectedRoutes.some(r => pathname.startsWith(r)) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
