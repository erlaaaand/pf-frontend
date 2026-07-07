"use client"

import * as React from "react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "../ui/sidebar"

// Import ikon sesuai dengan konteks fitur backend
import {
  LayoutDashboardIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  CreditCardIcon,
  UsersIcon,
  UserIcon,
  UserCogIcon,
  ActivityIcon,
  Settings2Icon,
  RocketIcon
} from "lucide-react"

// Membagi data berdasarkan konteks (Section)
const data = {
  user: {
    name: "Admin Festival",
    email: "admin@festival.com",
    avatar: "/avatars/admin.jpg",
  },

  // SECTION 1: UTAMA
  navDashboard: [
    {
      title: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
  ],

  // SECTION 2: MANAJEMEN LOMBA
  navCompetition: [
    {
      title: "Daftar Lomba",
      url: "#",
      icon: <TrophyIcon />,
    },
    {
      title: "Gelombang (Waves)",
      url: "#",
      icon: <CalendarDaysIcon />,
    },
  ],

  // SECTION 3: REGISTRASI & TRANSAKSI
  navTransactions: [
    {
      title: "Semua Pendaftaran",
      url: "#",
      icon: <ClipboardCheckIcon />,
    },
    {
      title: "Status Pembayaran",
      url: "#",
      icon: <CreditCardIcon />,
      isActive: true, // Default terbuka
      items: [
        { title: "Menunggu Pembayaran", url: "#" },
        { title: "Terverifikasi (Moota)", url: "#" },
        { title: "Dibatalkan / Expired", url: "#" },
      ],
    },
  ],

  // SECTION 4: PESERTA & PENGGUNA
  navUsers: [
    {
      title: "Data Tim",
      url: "#",
      icon: <UsersIcon />,
    },
    {
      title: "Peserta Individu",
      url: "#",
      icon: <UserIcon />,
    },
    {
      title: "Manajemen Akun",
      url: "#",
      icon: <UserCogIcon />,
      items: [
        { title: "Semua Pengguna", url: "#" },
        { title: "Hak Akses (Roles)", url: "#" },
      ],
    },
  ],

  // SECTION 5: SISTEM
  navSystem: [
    {
      title: "Log Webhook",
      url: "#",
      icon: <ActivityIcon />,
    },
    {
      title: "Pengaturan Sistem",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <RocketIcon className="size-5!" />
              <span className="text-base font-semibold">Admin Control Panel</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* SECTION 1: UTAMA */}
        <SidebarGroup>
          <NavMain items={data.navDashboard} />
        </SidebarGroup>

        {/* SECTION 2: MANAJEMEN LOMBA */}
        <SidebarGroup>
          <SidebarGroupLabel>Manajemen Lomba</SidebarGroupLabel>
          <NavMain items={data.navCompetition} />
        </SidebarGroup>

        {/* SECTION 3: REGISTRASI & TRANSAKSI */}
        <SidebarGroup>
          <SidebarGroupLabel>Registrasi & Keuangan</SidebarGroupLabel>
          <NavMain items={data.navTransactions} />
        </SidebarGroup>

        {/* SECTION 4: PESERTA & PENGGUNA */}
        <SidebarGroup>
          <SidebarGroupLabel>Data Peserta</SidebarGroupLabel>
          <NavMain items={data.navUsers} />
        </SidebarGroup>

        {/* SECTION 5: SISTEM */}
        <SidebarGroup>
          <SidebarGroupLabel>Sistem & Konfigurasi</SidebarGroupLabel>
          <NavMain items={data.navSystem} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}