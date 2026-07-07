import * as React from "react"
import { Bell } from "lucide-react"

import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"
// IMPORT buttonVariants DARI SHADCN
import { buttonVariants } from "../ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { cn } from "../../lib/utils" // Pastikan kamu mengimport 'cn' dari utils

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:px-6">

        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 h-4 data-[orientation=vertical]:self-auto"
          />
          <h1 className="text-base font-medium">Dashboard Admin</h1>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
              <PopoverTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  // Kita atur ukuran eksplisit dan pastikan isinya di tengah (center)
                  "relative flex h-8 w-8 items-center justify-center rounded-full p-0"
                )}
              >
                <Bell className="h-4 w-4" />

                {/* Posisi titik merah disesuaikan agar ada di sudut kanan atas tombol */}
                <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />

                <span className="sr-only">Toggle notifications</span>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-80 p-0 shadow-lg">
              {/* ... Isi panel notifikasi tetap sama seperti sebelumnya ... */}
              <div className="flex flex-col p-4 border-b">
                <span className="text-sm font-semibold">Notifikasi</span>
                <span className="text-xs text-muted-foreground">Kamu memiliki 2 pesan baru.</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>

      </div>
    </header>
  )
}