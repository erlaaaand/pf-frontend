import type { Metadata } from "next"
// Hapus import font Inter dan globals.css dari sini, biarkan itu di app/layout.tsx saja
import { Toaster } from "@/src/components/ui/sonner"

// Metadata ini akan otomatis menimpa (override) metadata dari Root Layout khusus untuk halaman admin
export const metadata: Metadata = {
  title: "Admin | Physics Festival",
  description: "Panel administrasi pendaftaran dan kelola lomba",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Gunakan <div> biasa atau React Fragment (<>), JANGAN gunakan <html> dan <body>
    <div className="flex min-h-full flex-col">
      {/* 
        Jika kamu menggunakan SidebarProvider, letakkan di sini membungkus children.
        Contoh:
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      */}
      {children}
      
      {/* Toaster bisa diletakkan di sini, meski idealnya Toaster cukup dipanggil 1x di Root Layout (app/layout.tsx) */}
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
