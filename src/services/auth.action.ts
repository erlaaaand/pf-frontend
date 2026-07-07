'use server'

import { cookies } from 'next/headers'
import { API_BASE_URL } from '../lib/constants'

export async function loginAction(credentials: any) {
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
