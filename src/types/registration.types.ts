// types/registration.types.ts
// Sesuai: src/modules/festival/registrations (pf-backend)

/** Status pendaftaran lomba */
export enum RegistrationStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/** Gelar juara yang bisa ditetapkan admin/panitia ke sebuah registrasi */
export enum ChampionTitle {
  NONE = 'NONE',
  JUARA_1 = 'JUARA_1',
  JUARA_2 = 'JUARA_2',
  JUARA_3 = 'JUARA_3',
  HONORABLE_MENTION = 'HONORABLE_MENTION',
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/** Body untuk POST /registrations */
export interface RegisterCompetitionPayload {
  competitionId: string;
  waveId: string;
  /** Wajib diisi jika lomba bertipe TEAM. Hanya ketua tim yang boleh mengirim ini. */
  teamId?: string;
}

/** Body untuk PATCH /registrations/admin/:id/set-champion (khusus ADMIN/COMMITTEE) */
export interface SetChampionPayload {
  title: ChampionTitle;
}

// ── Response ─────────────────────────────────────────────────────────────────

/** Response dari POST/GET registrations (RegistrationResponseDto) */
export interface Registration {
  id: string;
  competitionId: string;
  competitionName: string;
  waveName: string;
  teamName: string | null;
  /** Nama user jika ini registrasi individu */
  participantName: string | null;
  status: RegistrationStatus;
  championTitle: ChampionTitle;
  registeredAt: string;
}

/**
 * Label Bahasa Indonesia untuk tiap status, memudahkan pemetaan badge/warna di UI.
 * (bukan dari backend — murni util tampilan FE)
 */
export const REGISTRATION_STATUS_LABEL: Record<RegistrationStatus, string> = {
  [RegistrationStatus.PENDING_PAYMENT]: 'Menunggu Pembayaran',
  [RegistrationStatus.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
  [RegistrationStatus.VERIFIED]: 'Terverifikasi',
  [RegistrationStatus.REJECTED]: 'Ditolak',
  [RegistrationStatus.CANCELLED]: 'Dibatalkan',
};

export const CHAMPION_TITLE_LABEL: Record<ChampionTitle, string> = {
  [ChampionTitle.NONE]: '-',
  [ChampionTitle.JUARA_1]: 'Juara 1',
  [ChampionTitle.JUARA_2]: 'Juara 2',
  [ChampionTitle.JUARA_3]: 'Juara 3',
  [ChampionTitle.HONORABLE_MENTION]: 'Honorable Mention',
};