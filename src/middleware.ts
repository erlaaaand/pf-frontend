import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fungsi bantuan untuk men-decode JWT di Edge Runtime (tanpa library jsonwebtoken)
function getRoleFromToken(token: string): string | null {
  try {
    const payloadBase64Url = token.split('.')[1];
    // Perbaiki format Base64Url menjadi Base64 standar
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedJson = JSON.parse(atob(payloadBase64));

    // Asumsi payload JWT dari NestJS kamu menyimpan role di properti 'role'
    return decodedJson.role;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const path = request.nextUrl.pathname;

  // 1. Definisikan Kategori Rute
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register') || path.startsWith('/verify');
  const isPublicRoute = path === '/' || path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/public');

  // --- LOGIKA KETIKA BELUM LOGIN ---
  if (!token) {
    // Jika mencoba akses halaman selain Auth dan Public, lempar ke Login
    if (!isAuthRoute && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const role = getRoleFromToken(token);

  // Jika token rusak atau tidak memiliki role, paksa hapus cookie dan arahkan ke login
  if (!role) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('accessToken');
    return response;
  }

  // 2. Mencegah user login membuka halaman login/register berulang kali
  if (isAuthRoute) {
    if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (role === 'COMMITTEE') return NextResponse.redirect(new URL('/committee/dashboard', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 3. RBAC (Role-Based Access Control) Inti
  // Admin memblokir non-admin
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Committee memblokir non-committee
  if (path.startsWith('/committee') && role !== 'COMMITTEE') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Peserta (Siswa) - Opsional: Mencegah admin masuk ke rute siswa jika tidak diinginkan
  const isSiswaRoute = path.startsWith('/dashboard') || path.startsWith('/teams') || path.startsWith('/submissions') || path.startsWith('/registrations');
  if (isSiswaRoute && role !== 'PARTICIPANT') {
    const targetDashboard = role === 'ADMIN' ? '/admin/dashboard' : '/committee/dashboard';
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

// 4. Config Matcher
export const config = {
  // Middleware akan dijalankan pada semua rute KECUALI file statis dan gambar bawaan Next.js
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
