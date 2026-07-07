// types/submission.types.ts
// Sesuai: src/modules/festival/submissions (pf-backend)

/** Status karya lomba */
export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
}

/** Response dari endpoint submissions (SubmissionResponseDto) */
export interface Submission {
  id: string;
  registrationId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  status: SubmissionStatus;
  score: number | null;
  submittedAt: string;
}

// ── Payload (Request Body) ──────────────────────────────────────────────────

/**
 * Payload untuk POST /submissions (dikirim sebagai multipart/form-data).
 *
 * ⚠️ Catatan penting hasil audit source code backend
 * (`submissions.orchestrator.ts` & `create-submission.use-case.ts`):
 * - `file` **WAJIB** diisi. Orchestrator melempar 400 `BadRequestException`
 *   ("File karya wajib diunggah.") jika tidak ada file di request — BUKAN
 *   field opsional.
 * - Backend meng-upload ulang `file` tersebut secara internal lewat
 *   StorageOrchestrator (context: "submissions"), TAPI nilai `fileUrl` yang
 *   akhirnya disimpan ke database diambil dari `dto.fileUrl` (nilai yang kita
 *   kirim), BUKAN dari hasil upload internal itu. Karena DTO tetap
 *   memvalidasi `fileUrl` sebagai URL wajib (`@IsUrl @IsNotEmpty`), maka alur
 *   yang benar di FE adalah:
 *     1) Upload file lebih dulu ke `POST /storage/upload`
 *        (purpose: COMPETITION_WORK) → dapatkan `fileUrl`.
 *     2) Kirim `fileUrl` tsb SEKALIGUS file yang sama (raw file) ke endpoint
 *        ini dalam satu multipart request.
 *   Ya, ini berarti file yang sama diunggah dua kali (sekali manual ke
 *   storage, sekali lagi otomatis oleh backend saat submit). Ini adalah
 *   perilaku backend saat ini, bukan kesalahan penyusunan core FE.
 */
export interface CreateSubmissionPayload {
  registrationId: string;
  title: string;
  description?: string;
  /** Wajib — lihat catatan alur upload di atas. */
  fileUrl: string;
  /** Wajib — file mentah karya yang akan diunggah. */
  file: File;
}
