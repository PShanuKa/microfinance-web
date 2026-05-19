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
  ShieldUser,
  CalendarDays,
  Target,
  Cog,
  ClipboardList,
  History,
  Building,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/services/authApi";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  allowedRoles?: string[];
}

interface MenuGroup {
  title: string;
  allowedRoles?: string[];
  items: MenuItem[];
}

const items: MenuGroup[] = [
  {
    title: "Modules",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/", allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR"] },
      { icon: Users, label: "Clients", href: "/clients", allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER"] },
    ],
  },
  {
    title: "Arunodayata Saviyak",
    allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER"],
    items: [
      { icon: UsersRound, label: "Groups", href: "/groups" },
      { icon: Wallet, label: "Loans", href: "/loans" },
    ],
  },
  {
    title: "Morgage Loans",
    allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER"],
    items: [{ icon: Wallet, label: "Loans", href: "/loans" }],
  },
  {
    title: "Collections",
    allowedRoles: ["ADMIN", "BRANCH_MANAGER", "COLLECTION_OFFICER", "AUDITOR"],
    items: [
      { icon: Receipt, label: "Collections", href: "/collections", allowedRoles: ["ADMIN", "BRANCH_MANAGER", "AUDITOR"] },
      {
        icon: ClipboardList,
        label: "Collection Registry",
        href: "/collection-registry",
      },
    ],
  },
  {
    title: "Reports",
    allowedRoles: ["ADMIN", "BRANCH_MANAGER", "AUDITOR", "APPROVER"],
    items: [
      { icon: ShieldAlert, label: "Blacklist", href: "/blacklist" },
      // { icon: FileBarChart, label: "Reports", href: "/reports" },
    ],
  },
  {
    title: "System Settings",
    allowedRoles: ["ADMIN"],
    items: [
      { icon: ShieldUser, label: "User Management", href: "/user-management" },
      { icon: Building, label: "Branch Management", href: "/branches" },
      { icon: History, label: "Audit Logs", href: "/audit-logs" },
      { icon: CalendarDays, label: "Non-Collection Weeks", href: "/con-weeks" },
      // { icon: Target, label: "Collection Targets", href: "/col-targets" },
      { icon: Cog, label: "Settings", href: "/settings" },
    ],
  },
];

export default function SideBar() {
  const pathname = usePathname();
  const { toggleSideBar } = useUiStore();
  const { data: userData } = useGetMeQuery();
  const userRole = userData?.user?.role;

  return (
    <div className="bg-(--sidebar-bg) h-screen w-full">
      <div className="border-b border-(--sidebar-border) w-full h-[60px] flex items-center justify-between px-4">
        <h1 className="text-white text-2xl font-bold">Don and Dons</h1>
        <X className="text-white" size={18} onClick={() => toggleSideBar()} />
      </div>

      <div>
        <div className="w-full  flex flex-col gap-1 mt-5 px-2">
          {items.map((group, index) => {
            // Check group-level role access
            if (group.allowedRoles && (!userRole || !group.allowedRoles.includes(userRole))) {
              return null;
            }

            return (
              <div key={index}>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {group.title}
                </p>
                {group.items.map((item, innerIndex) => {
                  // Check item-level role access
                  if (item.allowedRoles && (!userRole || !item.allowedRoles.includes(userRole))) {
                    return null;
                  }

                  return (
                    <SideBarButton
                      href={item.href}
                      isActive={pathname == item.href}
                      key={innerIndex}
                      icon={
                        <item.icon
                          className={`  ${pathname == item.href ? "text-white" : "text-(--sidebar-text)"} h-5 w-5`}
                        />
                      }
                      text={item.label}
                    />
                  );
                })}
              </div>
            );
          })}
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
        <h1
          className={`  ${isActive ? "text-white" : "text-(--sidebar-text)"} text-md font-semibold `}
        >
          {text}
        </h1>
      </div>
    </Link>
  );
}
