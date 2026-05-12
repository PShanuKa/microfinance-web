"use client"

import NavBar from "@/components/LayoutComponents/NavBar";
import Sidebar from "@/components/LayoutComponents/SideBar";
import { useUiStore } from "@/store/useUiStore";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sideBarOpen , setSideBar } = useUiStore();

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
      <div className={`flex-1 flex flex-col transition-all duration-300 bg-background`}>
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