// admin/submissions/_components/submissions-table-card.tsx
"use client"

import { ExternalLink, InboxIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Skeleton } from "@/src/components/ui/skeleton"
import type { SubmissionRow } from "../_types"

interface SubmissionsTableCardProps {
  hasSelectedCompetition: boolean
  activeCompetitionName?: string
  isLoading: boolean
  submissions: SubmissionRow[]
}

export function SubmissionsTableCard({
  hasSelectedCompetition,
  activeCompetitionName,
  isLoading,
  submissions,
}: SubmissionsTableCardProps) {
  
  if (!hasSelectedCompetition) {
    return <EmptyState message="Pilih lomba terlebih dahulu untuk melihat karya." />
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (submissions.length === 0) {
    return <EmptyState message="Belum ada karya yang dikumpulkan untuk lomba ini." />
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden w-full flex flex-col">
      {/* Dynamic Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">
          Karya Peserta: <span className="text-[#5C7C99]">{activeCompetitionName || "Lomba"}</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">{submissions.length} karya berhasil dikumpulkan.</p>
      </div>

      {/* Table Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Judul Karya</th>
              <th className="px-6 py-4 font-medium">Peserta / Tim</th>
              <th className="px-6 py-4 font-medium">Tanggal Kumpul</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 truncate max-w-[300px]">{submission.title}</div>
                  {submission.description ? (
                    <div className="line-clamp-1 text-sm text-gray-500 mt-0.5 max-w-[300px]">
                      {submission.description}
                    </div>
                  ) : null}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {submission.teamName ?? submission.participantName ?? "-"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {submission.submittedAt
                    ? new Intl.DateTimeFormat("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(submission.submittedAt))
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="shadow-none border-gray-200 text-gray-600 h-8 px-3 hover:bg-gray-50"
                    onClick={() => window.open(submission.fileUrl, "_blank", "noopener,noreferrer")}
                  >
                    Buka File <ExternalLink className="ml-2 size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex flex-col divide-y divide-gray-100">
        {submissions.map((submission, index) => (
          <div key={submission.id} className="p-5 flex flex-col gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {submission.title}
              </h3>
              {submission.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {submission.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
              <div><span className="text-gray-500 mr-2">Peserta/Tim:</span> {submission.teamName ?? submission.participantName ?? "-"}</div>
              <div>
                <span className="text-gray-500 mr-2">Tgl Kumpul:</span>
                {submission.submittedAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(submission.submittedAt))
                  : "-"}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-2 shadow-none border-gray-200 text-gray-700"
              onClick={() => window.open(submission.fileUrl, "_blank", "noopener,noreferrer")}
            >
              Buka File <ExternalLink className="ml-2 size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="p-4 bg-gray-50 rounded-full">
        <InboxIcon className="size-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 max-w-[250px]">{message}</p>
    </div>
  )
}
