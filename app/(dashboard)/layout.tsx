"use client"

import NavBar from "@/components/LayoutComponents/NavBar";
import Sidebar from "@/components/LayoutComponents/SideBar";
import { useUiStore } from "@/store/useUiStore";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { PremiumLoading } from "@/components/Custom/PremiumLoading";

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

  // Show Premium Loading if either API is fetching OR our minimum timer is running
  if (isLoading || minLoading || !data) {
    return <PremiumLoading />;
  }


  return (
    <div className="w-full flex h-screen overflow-hidden relative">
      {/* Sidebar Section */}
      <div 
        className={`${
          sideBarOpen ? 'md:w-[15%] min-w-[250px] w-full translate-x-0' : 'w-0 -translate-x-full'
        } transition-all ease-in-out  duration-300 overflow-hidden border-r absolute md:relative`}
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
    </div>
  );
}