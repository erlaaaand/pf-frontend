"use client"

import { useState } from "react"
import { ClipboardCheckIcon, EyeIcon, XIcon } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  CHAMPION_OPTIONS,
  statusLabel,
  type Registration,
} from "../_lib/status"

interface RegistrationsTableCardProps {
  activeCompetition: string
  activeCompetitionName: string
  isLoading: boolean
  registrations: Registration[]
}

export function RegistrationsTableCard({
  activeCompetition,
  activeCompetitionName,
  isLoading,
  registrations,
}: RegistrationsTableCardProps) {
  const [detailModal, setDetailModal] = useState<Registration | null>(null)

  if (!activeCompetition) {
    return (
      <EmptyState message="Pilih lomba terlebih dahulu untuk melihat data pendaftar." />
    )
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

  if (registrations.length === 0) {
    return (
      <EmptyState message="Belum ada pendaftar yang terverifikasi untuk lomba ini." />
    )
  }

  return (
    <>
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden w-full flex flex-col">
        {/* Dynamic Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            Data Peserta: <span className="text-[#5C7C99]">{activeCompetitionName || "Lomba"}</span>
          </h2>
        </div>

        {/* Table Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium w-16 text-center">No</th>
                <th className="px-6 py-4 font-medium">Peserta / Tim</th>
                <th className="px-6 py-4 font-medium">Asal Sekolah</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Gelar Juara</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.map((registration, index) => {
                const championLabel = CHAMPION_OPTIONS.find(
                  (opt) => opt.value === (registration.championTitle ?? "NONE"),
                )?.label ?? "Belum ditentukan"
                
                const institutionName = registration.institution ?? "-"
                const isTeam = !!registration.teamName
                const leaderName = registration.participantName ?? "-"

                let badgeClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
                if (registration.status === "VERIFIED") {
                  badgeClass = "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none"
                }

                return (
                  <tr key={registration.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 text-center">{index + 1}</td>
                    <td className="px-6 py-4">
                      {isTeam ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{registration.teamName}</span>
                          <span className="text-xs text-gray-500 mt-0.5">Ketua: {leaderName}</span>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-900">{registration.participantName ?? "-"}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{institutionName}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className={`font-normal shadow-none ${badgeClass}`}>
                        {statusLabel(registration.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="font-medium bg-gray-50 text-gray-700 border-gray-200">
                        {championLabel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="shadow-none border-gray-200 text-gray-600 h-8 px-3"
                        onClick={() => setDetailModal(registration)}
                      >
                        <EyeIcon className="size-4 mr-2" />
                        Detail
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Stack Cards) */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {registrations.map((registration, index) => {
            const championLabel = CHAMPION_OPTIONS.find(
              (opt) => opt.value === (registration.championTitle ?? "NONE"),
            )?.label ?? "Belum ditentukan"
            
            const institutionName = registration.institution ?? "-"
            const isTeam = !!registration.teamName
            const leaderName = registration.participantName ?? "-"

            let badgeClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-none"
            if (registration.status === "VERIFIED") {
              badgeClass = "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none"
            }

            return (
              <div key={registration.id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-gray-900 text-base leading-tight">
                      <span className="font-medium">{index + 1}.</span> {isTeam ? <span className="font-bold">{registration.teamName}</span> : <span className="font-medium">{registration.participantName ?? "-"}</span>}
                    </h3>
                    {isTeam && <p className="text-xs text-gray-500 mt-1">Ketua: {leaderName}</p>}
                    <p className="text-sm text-gray-500 mt-1">{institutionName}</p>
                  </div>
                  <Badge variant="secondary" className={`font-normal shrink-0 shadow-none ${badgeClass}`}>
                    {statusLabel(registration.status)}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span>Gelombang:</span>
                    <span className="font-medium text-gray-900">{registration.waveName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 p-3">
                    <span>Gelar Juara:</span>
                    <Badge variant="outline" className="font-medium bg-gray-50 text-gray-700 border-gray-200">
                      {championLabel}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-2 shadow-none border-gray-200 text-gray-700"
                    onClick={() => setDetailModal(registration)}
                  >
                    <EyeIcon className="size-4 mr-2 text-gray-400" />
                    Lihat Detail Pendaftar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {detailModal && (
        <DetailModal 
          registration={detailModal} 
          onClose={() => setDetailModal(null)} 
          competitionName={activeCompetitionName} 
        />
      )}
    </>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
      <div className="p-4 bg-gray-50 rounded-full">
        <ClipboardCheckIcon className="size-8 text-gray-400" />
      </div>
      <p className="text-sm text-gray-500 max-w-[250px]">{message}</p>
    </div>
  )
}

function DetailModal({ registration, onClose, competitionName }: { registration: Registration, onClose: () => void, competitionName: string }) {
  const institutionName = registration.institution ?? "-"
  const isTeam = !!registration.teamName
  const leaderName = registration.participantName ?? "-"
  const members = registration.members || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Detail Pendaftar</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <XIcon className="size-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Nama Lomba</p>
            <p className="font-medium text-gray-900">{competitionName || registration.competitionName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Asal Sekolah</p>
            <p className="font-medium text-gray-900">{institutionName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Gelombang</p>
            <p className="font-medium text-gray-900">{registration.waveName}</p>
          </div>
          
          {isTeam ? (
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <p className="text-sm text-gray-500 mb-3">Informasi Tim</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nama Tim:</span>
                  <span className="font-bold text-gray-900">{registration.teamName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ketua Tim:</span>
                  <span className="font-medium text-gray-900">{leaderName}</span>
                </div>
                {members.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Anggota Lainnya</p>
                    <ul className="flex flex-col gap-2">
                      {members.map((m: any, i: number) => (
                        <li key={i} className="text-sm text-gray-800 flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-[#5C7C99]" />
                          {m.name || m.participantName || m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-1">Nama Peserta</p>
              <p className="font-medium text-gray-900">{registration.participantName ?? "-"}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-1">Status Pendaftaran</p>
            <Badge variant="secondary" className={registration.status === "VERIFIED" ? "bg-emerald-100 text-emerald-700 shadow-none border-none font-medium px-3 py-1" : "bg-gray-100 text-gray-700 shadow-none border-none font-medium px-3 py-1"}>
              {statusLabel(registration.status)}
            </Badge>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <Button onClick={onClose} className="bg-white border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm" variant="outline">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
