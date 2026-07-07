'use server'
// services/auth.service.ts
// Pemisah logika API untuk modul Auth (pf-backend: /api/v1/auth/*)

import api, { clearAuthToken, setAuthToken } from '../lib/axios';
// import { cookies } from 'next/headers'
import type {
  AuthResponse,
  CurrentUserPayload,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
} from '../types/auth.types';

/**
 * Daftar akun baru. Akun BELUM aktif setelah ini — user harus verifikasi
 * OTP (dikirim ke email) lewat verifyEmail() untuk mendapat accessToken.
 * Rate limit backend: 5 request/menit per IP.
 */
export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(
    '/auth/register',
    payload,
  );
  return data;
}

/**
 * Login dengan email & password. Akan gagal (401) jika akun belum
 * diverifikasi emailnya. Otomatis menyimpan accessToken ke storage.
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  setAuthToken(data.accessToken);
  return data;
}

/**
 * Verifikasi OTP yang dikirim saat register. Jika sukses, akun langsung
 * aktif dan accessToken otomatis disimpan (tidak perlu login ulang).
 */
export async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    '/auth/verify-email',
    payload,
  );
  setAuthToken(data.accessToken);
  return data;
}

/** Info singkat user yang sedang login, diambil langsung dari payload JWT. */
export async function getMe(): Promise<CurrentUserPayload> {
  const { data } = await api.get<CurrentUserPayload>('/auth/me');
  return data;
}

/**
 * Logout. Backend bersifat STATELESS JWT (tidak ada blacklist token),
 * sehingga fungsi ini SELALU menghapus token lokal terlebih dahulu agar
 * user tetap "keluar" di sisi FE walau request ke server gagal (mis. offline).
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const { data } = await api.post<{ message: string }>('/auth/logout');
    return data;
  } finally {
    clearAuthToken();
  }
}
