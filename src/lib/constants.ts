// lib/constants.ts
// Konstanta & aturan bisnis yang berasal langsung dari pf-backend.
// Simpan di sini agar tidak "hardcode tersebar" di komponen/form UI.

// ── Storage / Upload ─────────────────────────────────────────────────────

/** MIME type yang diterima backend (storage-domain.service.ts) */
export const ALLOWED_FILE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const;

/** Ekstensi yang cocok dengan ALLOWED_FILE_MIME_TYPES, untuk atribut `accept` di <input type="file"> */
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

/**
 * Batas ukuran file untuk `POST /storage/upload`.
 * Backend punya 2 lapis validasi ukuran yang berbeda:
 * - `FileSizeGuard` (hanya di endpoint ini): hard cap 10MB berdasarkan
 *   header `Content-Length`.
 * - Multer `limits.fileSize`: 20MB.
 * Guard berjalan lebih dulu, jadi batas EFEKTIF untuk endpoint upload
 * adalah 10MB, bukan 20MB. Validasi di FE sebaiknya pakai angka ini agar
 * user tidak menunggu upload gagal di tengah jalan.
 */
export const MAX_STORAGE_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Batas ukuran file untuk `POST /submissions` (tidak pakai FileSizeGuard,
 * hanya multer limits.fileSize).
 */
export const MAX_SUBMISSION_FILE_BYTES = 20 * 1024 * 1024; // 20MB

// ── Registrations ────────────────────────────────────────────────────────

/**
 * Maksimal jumlah lomba aktif (status selain CANCELLED/REJECTED) yang
 * boleh diikuti satu user/tim secara bersamaan.
 * (register-competition.use-case.ts)
 */
export const MAX_ACTIVE_REGISTRATIONS_PER_USER = 3;

/**
 * Jumlah maksimal percobaan generate kode unik (uniqueCode) pembayaran
 * sebelum registrasi dianggap gagal. Murni informasi, tidak perlu
 * ditangani di FE — sekadar dokumentasi batas retry backend.
 */
export const MAX_UNIQUE_CODE_RETRY_ATTEMPTS = 15;

// ── Rate Limiting (auth) ─────────────────────────────────────────────────

/** Rate limit backend untuk /auth/register dan /auth/login: 5x per menit per IP */
export const AUTH_RATE_LIMIT = {
  limit: 5,
  windowMs: 60_000,
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';