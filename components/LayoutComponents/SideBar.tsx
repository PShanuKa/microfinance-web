
"use client";

import { useUiStore } from "@/store/useUiStore";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Wallet,
  Receipt,
  ShieldAlert,
  FileBarChart,
  Settings,
  X,
  Box,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Clients", href: "/clients" },
  { icon: UsersRound, label: "Groups", href: "/groups" },
  { icon: Wallet, label: "Loans", href: "/loans" },
  { icon: Receipt, label: "Collections", href: "/collections" },
  { icon: ShieldAlert, label: "Blacklist", href: "/blacklist" },
  { icon: FileBarChart, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Administration", href: "/admin" },

  /* Dev links */
  { icon: Box, label: "Components-Dev", href: "/components" },
  

];



export default function SideBar() {
  const pathname = usePathname();
  const { toggleSideBar } = useUiStore();

  return (
    <div className="bg-(--sidebar-bg) h-screen w-full">
      <div className="border-b border-(--sidebar-border) w-full h-[60px] flex items-center justify-between px-4">
        <h1 className="text-white text-2xl font-bold">Logo</h1>
        <X className="text-white" size={18} onClick={() => toggleSideBar()} />
      </div>

      <div>
        <div className="w-full  flex flex-col gap-1 mt-5 px-2">
          {navItems.map((item) => (
            <SideBarButton
              href={item.href}
              isActive={pathname == item.href}
              key={item.label}
              icon={<item.icon className={`  ${pathname == item.href ? "text-white" : "text-(--sidebar-text)"} h-5 w-5`} />}
              text={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SideBarButton({
  icon,
  text,
  href,
  isActive,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`rounded-lg w-full h-[40px] flex flex-row items-center gap-3 pl-3 hover:cursor-pointer  ${isActive ? "bg-(--sidebar-button-bg)" : ""}`}
      >
        {icon}
        <h1 className={`  ${isActive ? "text-white" : "text-(--sidebar-text)"} text-md font-semibold `}>{text}</h1>
      </div>
    </Link>
  );
}