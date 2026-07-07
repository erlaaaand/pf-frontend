// lib/jwt.ts

export interface DecodedAccessToken {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded.padEnd(
    padded.length + ((4 - (padded.length % 4)) % 4),
    '=',
  );

  if (typeof atob === 'function') {
    // Browser & Edge Runtime
    return decodeURIComponent(
      atob(withPadding)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  }

  // Node.js fallback (mis. saat dites via jest/node script)
  return Buffer.from(withPadding, 'base64').toString('utf-8');
}

export function decodeAccessToken(
  token: string | null | undefined,
): DecodedAccessToken | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1])) as DecodedAccessToken;
    if (!payload.role || !payload.sub) return null;
    return payload;
  } catch {
    return null;
  }
}

/** true jika token sudah lewat waktu `exp` (dengan toleransi 0 detik). */
export function isTokenExpired(token: string | null | undefined): boolean {
  const decoded = decodeAccessToken(token);
  if (!decoded?.exp) return false; // tidak tahu exp -> anggap belum expired, biar 401 dari backend yang tentukan
  return Date.now() >= decoded.exp * 1000;
}
