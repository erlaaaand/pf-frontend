'use server'

import { cookies } from 'next/headers'
import { API_BASE_URL } from '../lib/constants'
import type { LoginPayload, VerifyEmailPayload } from '../types/auth.types'

// 1. Aksi Login
export async function loginAction(credentials: LoginPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Login gagal')

  // Set httpOnly cookie di sisi server
  const cookieStore = await cookies()
  cookieStore.set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  })

  return data.user
}

// 2. Aksi Verifikasi Email
export async function verifyEmailAction(payload: VerifyEmailPayload) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Verifikasi gagal')

  // Karena verify-email dari backend juga mengembalikan token, kita harus set cookie di sini
  const cookieStore = await cookies()
  cookieStore.set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  })

  return data.user
}

// 3. Aksi Logout
export async function logoutAction() {
  try {
    // Beritahu backend bahwa user logout (opsional, karena backend menggunakan JWT stateless)
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Gagal memanggil endpoint logout, namun sesi lokal tetap akan dihapus", error);
  }

  // Hapus cookie dari browser pengguna secara aman melalui server
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
}
