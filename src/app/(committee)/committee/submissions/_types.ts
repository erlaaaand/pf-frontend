// committee/submissions/_types.ts

export interface SubmissionRow {
  id: string
  title: string
  description?: string | null
  fileUrl: string
  submittedAt: string
  participantName?: string
  teamName?: string
  participantEmail?: string
}

export interface Competition {
  id?: string | null
  name: string
}
