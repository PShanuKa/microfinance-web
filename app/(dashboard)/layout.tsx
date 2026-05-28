"use client"

import NavBar from "@/components/LayoutComponents/NavBar";
import Sidebar from "@/components/LayoutComponents/SideBar";
import { useUiStore } from "@/store/useUiStore";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/services/authApi";
import { useRouter, usePathname } from "next/navigation";
import { PremiumLoading } from "@/components/Custom/PremiumLoading";
import { Button } from "@/components/ui/button";
import { CommonDialog } from "@/components/common/Dialog";

// Define route patterns and the roles allowed to access them
const ROUTE_PERMISSIONS: { pattern: RegExp; allowedRoles: string[] }[] = [
  // Dashboard & Root
  { pattern: /^\/$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR"] },

  // Admin & Settings
  { pattern: /^\/user-management(\/|$)/, allowedRoles: ["ADMIN"] },
  { pattern: /^\/branches(\/|$)/, allowedRoles: ["ADMIN"] },
  { pattern: /^\/audit-logs(\/|$)/, allowedRoles: ["ADMIN" , "AUDITOR"] },
  { pattern: /^\/con-weeks(\/|$)/, allowedRoles: ["ADMIN", "AUDITOR"] },
  { pattern: /^\/settings(\/|$)/, allowedRoles: ["ADMIN"] },
  
  // Collections & registries
  { pattern: /^\/collections(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "AUDITOR" , "APPROVER"] },
  { pattern: /^\/collection-registry(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "COLLECTION_OFFICER", "AUDITOR", ] },
  { pattern: /^\/blacklist(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "AUDITOR", "APPROVER"] },
  { pattern: /^\/reports(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "AUDITOR", "APPROVER"] },
  
  // Clients precise routing
  { pattern: /^\/clients\/new\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"] },
  { pattern: /^\/clients\/[^\/]+\/edit\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"] },
  { pattern: /^\/clients\/[^\/]+\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR"] },
  { pattern: /^\/clients\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER"] },
  
  // Groups precise routing
  { pattern: /^\/groups\/create\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"] },
  { pattern: /^\/groups\/[^\/]+\/edit\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER","LOAN_OFFICER"] },
  { pattern: /^\/groups\/[^\/]+\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR", "COLLECTION_OFFICER"] }, // Details page is allowed for more roles (e.g. COLLECTION_OFFICER)
  { pattern: /^\/groups\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR"] }, // General list page

  // Loans precise routing
  { pattern: /^\/loans\/create\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"] },
  { pattern: /^\/loans\/[^\/]+\/edit-schedule\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"] },
  { pattern: /^\/loans\/[^\/]+\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR", "COLLECTION_OFFICER"] }, // Details page is allowed for more roles
  { pattern: /^\/loans\/?$/, allowedRoles: ["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER", "APPROVER", "AUDITOR"] }, // General list page

  // Mortgage Loans precise routing
  { pattern: /^\/mortgage-loans(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER","APPROVER", "AUDITOR","MORTGAGE_OFFICER"] },
  { pattern: /^\/mortgage-collection(\/|$)/, allowedRoles: ["ADMIN", "BRANCH_MANAGER","APPROVER", "AUDITOR", "MORTGAGE_COLLECTION"] },
];

// Define specific home/landing page redirects for roles when they hit the root "/" path
const ROLE_HOME_REDIRECTS: Record<string, string> = {
  COLLECTION_OFFICER: "/collection-registry",
  LOAN_OFFICER: "/loans",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sideBarOpen , setSideBar } = useUiStore();
  const router = useRouter();
  const [minLoading, setMinLoading] = useState(true);

  // Initial Auth Check
  const { isLoading, isError, data } = useGetMeQuery({
    retry: false,
  });

  useEffect(() => {
    // Minimum 1.2s loading time for premium feel
    const timer = setTimeout(() => {
      setMinLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) { 
        setSideBar(true);
      } else {
        setSideBar(false);
      }
    };


    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [setSideBar]);

  const pathname = usePathname();
  let userRoles = data?.user?.roles || [];
  if (typeof userRoles === 'string') {
    try { userRoles = JSON.parse(userRoles); } catch (e) { userRoles = []; }
  }

  // Check if they are allowed to access root dashboard
  const rootRule = ROUTE_PERMISSIONS.find((p) => p.pattern.test("/"));
  const canAccessRoot = rootRule ? userRoles.some((r: string) => rootRule.allowedRoles.includes(r)) : true;

  // Find if there is a specific home redirect for the current role (only if they can't access root)
  const matchedRedirectRole = userRoles.find((role: string) => ROLE_HOME_REDIRECTS[role]);
  const redirectTarget = pathname === "/" && !canAccessRoot && matchedRedirectRole ? ROLE_HOME_REDIRECTS[matchedRedirectRole] : null;
  const isRedirecting = !!redirectTarget;

  useEffect(() => {
    if (redirectTarget) {
      router.push(redirectTarget);
    }
  }, [redirectTarget, router]);

  // Check if user is allowed to access the current route
  const isAuthorized = (() => {
    if (userRoles.length === 0) return false;
    
    // If it's a redirecting state, consider it loaded/authorized temporarily during redirect
    if (isRedirecting) return true;

    // Find if there's a permission rule matching the current path
    const rule = ROUTE_PERMISSIONS.find((p) => p.pattern.test(pathname));
    
    // If no rule matches, it's public (e.g. Profile "/profile")
    if (!rule) {
      return true;
    }
    
    return userRoles.some((role: string) => rule.allowedRoles.includes(role));
  })();

  // Show Premium Loading if either API is fetching OR our minimum timer is running OR we are redirecting
  if (isLoading || minLoading || !data || isRedirecting) {
    return <PremiumLoading />;
  }

  if (!isAuthorized) {
    return (
      <div className="w-full flex h-screen overflow-hidden relative">
        {/* Sidebar Section */}
        <div 
          className={`${
            sideBarOpen ? 'md:w-[15%] min-w-[250px] w-full translate-x-0' : 'w-0 -translate-x-full'
          } transition-all ease-in-out duration-300 overflow-hidden border-r absolute md:relative z-10`}
        >
          <Sidebar />
        </div>

        {/* Main Content Section */}
        <div className="flex-1 flex flex-col bg-background w-full">
          <NavBar />
          <main className="p-5 w-full h-[calc(100vh-64px)] overflow-y-auto flex items-center justify-center">
            <div className="text-center max-w-md p-8 bg-card rounded-3xl border border-slate-200 shadow-2xl flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-rose-500 animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Access Denied</h2>
                <p className="text-sm font-semibold text-slate-500 mt-2 leading-relaxed">
                  Your current account role (<strong className="text-slate-700 uppercase font-black">{userRoles.join(", ").replace(/_/g, " ")}</strong>) does not have permission to access <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-rose-600">{pathname}</code>.
                </p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 font-bold rounded-xl text-white shadow-lg"
              >
                Back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex h-screen overflow-hidden relative">
      {/* Sidebar Section */}
      <div 
        className={`${
          sideBarOpen ? 'md:w-[15%] min-w-[250px] w-full translate-x-0' : 'w-0 -translate-x-full'
        } transition-all ease-in-out  duration-300 overflow-hidden border-r absolute md:relative z-10`}
      >
        <Sidebar />
      </div>

      {/* Main Content Section */}
      <div className={`flex-1 flex flex-col transition-all duration-300 bg-background w-full`}>
        <NavBar />
        <main className="p-5 w-full h-[calc(100vh-64px)] overflow-y-auto">
          <div className="w-full min-h-full">
            {children}
          </div>
        </main>
      </div>

      <CommonDialog />
    </div>
  );
}