// types/auth.types.ts
// Sesuai: src/modules/identity/auth & src/modules/identity/users (pf-backend)

/** Role user di sistem — harus sama persis dengan enum UserRole backend */
export enum UserRole {
  ADMIN = 'ADMIN',
  COMMITTEE = 'COMMITTEE',
  PARTICIPANT = 'PARTICIPANT',
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/** Body untuk POST /auth/register */
export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  institution: string;
}

/** Body untuk POST /auth/login */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Body untuk POST /auth/verify-email */
export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

/** Body untuk PATCH /users/:id */
export interface UpdateUserPayload {
  fullName?: string;
  /** Wajib diisi bersamaan dengan newPassword jika ingin ganti password */
  currentPassword?: string;
  /** Wajib diisi bersamaan dengan currentPassword jika ingin ganti password */
  newPassword?: string;
}

/** Body untuk POST /users/admin/create (khusus role ADMIN) */
export interface AdminCreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

/**
 * Body untuk PATCH /users/me/avatar.
 * Endpoint ini HANYA menerima referensi URL, bukan file mentah — upload
 * dulu file-nya lewat `storage.service.uploadFile()` (purpose:
 * `FilePurpose.PROFILE_PHOTO`), lalu kirim `fileUrl` hasilnya sebagai
 * `avatarUrl` di sini.
 */
export interface UpdateAvatarPayload {
  avatarUrl: string;
}

// ── Response ─────────────────────────────────────────────────────────────────

/** Data user ringkas yang dikembalikan bersama AuthResponse (login/register/verify) */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
}

/** Response dari POST /auth/login, /auth/register (via verify), /auth/verify-email */
export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  /** Contoh format: "7d", "24h" */
  expiresIn: string;
  user: AuthUser;
}

/** Response dari GET /auth/me (langsung dari payload JWT, bukan query DB) */
export interface CurrentUserPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
}

/**
 * Response dari GET /users/me dan GET /users/:id (UserResponseDto).
 *
 * ⚠️ Catatan hasil audit backend: `UserEntity` sebenarnya punya kolom
 * `avatarUrl` dan endpoint `PATCH /users/me/avatar` berhasil menyimpannya,
 * TAPI `UserMapper.toResponseDto()` di backend tidak pernah menyertakan
 * `avatarUrl` ke response manapun (`/users/me`, `/users/:id`, maupun hasil
 * `updateAvatar`). Jadi secara API saat ini, FE TIDAK BISA membaca kembali
 * avatarUrl user meski proses update-nya sendiri sukses. Ini keterbatasan
 * di sisi backend, bukan yang bisa diperbaiki dari core FE — perlu
 * diinfokan ke tim backend jika UI memang butuh menampilkan foto profil.
 */
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Response dari POST /auth/register (sebelum verifikasi email) */
export interface RegisterResponse {
  message: string;
  userId: string;
}

/** Response dari POST /users/admin/create */
export interface AdminCreateUserResponse {
  message: string;
  userId: string;
  email: string;
}
