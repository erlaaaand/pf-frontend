// services/registration.service.ts
// Pemisah logika API untuk modul Registrations
// (pf-backend: /api/v1/registrations/*)

import api from '../lib/axios';
import type {
  Registration,
  RegisterCompetitionPayload,
  SetChampionPayload,
} from '../types/registration.types';

/**
 * (Role PARTICIPANT) Mendaftar ke sebuah lomba, individu atau via tim.
 *
 * Hal penting untuk UI:
 * - Jika lomba bertipe TEAM, `teamId` wajib diisi dan HANYA ketua tim yang
 *   boleh mendaftarkan timnya.
 * - Maksimal 3 lomba aktif per user (status selain CANCELLED/REJECTED).
 * - Jika wave gratis, status langsung VERIFIED. Jika berbayar, status jadi
 *   PENDING_PAYMENT dengan batas waktu 24 jam.
 */
export async function registerCompetition(
  payload: RegisterCompetitionPayload,
): Promise<Registration> {
  const { data } = await api.post<Registration>('/registrations', payload);
  return data;
}

/** (Role PARTICIPANT) Riwayat semua pendaftaran lomba milik user & timnya. */
export async function getMyRegistrations(): Promise<Registration[]> {
  const { data } = await api.get<Registration[]>(
    '/registrations/my-registrations',
  );
  return data;
}

/**
 * (Role ADMIN/COMMITTEE) Daftar peserta yang sudah terverifikasi
 * pembayarannya untuk satu lomba tertentu.
 */
export async function getVerifiedParticipants(
  competitionId: string,
): Promise<Registration[]> {
  const { data } = await api.get<Registration[]>(
    `/registrations/admin/competition/${competitionId}/verified`,
  );
  return data;
}

/** (Role ADMIN/COMMITTEE) Menetapkan gelar juara ke satu pendaftaran. */
export async function setChampionTitle(
  id: string,
  payload: SetChampionPayload,
): Promise<Registration> {
  const { data } = await api.patch<Registration>(
    `/registrations/admin/${id}/set-champion`,
    payload,
  );
  return data;
}
