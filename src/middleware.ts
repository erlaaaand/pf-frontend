// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeAccessToken, isTokenExpired } from './lib/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/verify');
  const isPublicRoute = path === '/' || path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/public');

  // --- LOGIKA KETIKA BELUM LOGIN ---
  if (!token) {
    if (!isAuthRoute && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // --- LOGIKA KETIKA SUDAH LOGIN ---
  const decodedToken = decodeAccessToken(token);

  if (!decodedToken || isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    return response;
  }

  const role = decodedToken.role;

  if (isAuthRoute) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (role === 'COMMITTEE') return NextResponse.redirect(new URL('/committee/dashboard', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // RBAC (Role-Based Access Control)
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path.startsWith('/committee') && role !== 'COMMITTEE') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isSiswaRoute = path.startsWith('/dashboard') || path.startsWith('/teams') || path.startsWith('/submissions') || path.startsWith('/registrations');
  if (isSiswaRoute && role !== 'PARTICIPANT') {
    const targetDashboard = role === 'ADMIN' ? '/admin/dashboard' : '/committee/dashboard';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
