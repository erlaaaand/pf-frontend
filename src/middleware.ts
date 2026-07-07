import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Cek apakah cookie accessToken ada
  const token = request.cookies.get('accessToken')?.value

  // Daftar rute yang harus dilindungi
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/committee');

  // Jika mencoba akses rute terlarang tanpa token, tendang ke /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Jika sudah login tapi mencoba buka halaman /login atau /register, arahkan ke beranda/dashboard
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  if (isAuthRoute && token) {
     return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Terapkan middleware ini pada path tertentu saja
  matcher: ['/admin/:path*', '/dashboard/:path*', '/committee/:path*', '/login', '/register'],
}
