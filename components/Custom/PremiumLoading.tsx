"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export const PremiumLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl">
      <div className="relative flex flex-col items-center">
        {/* Animated Glow Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse delay-700" />
        
        {/* Main Spinner */}
        <div className="relative">
          <Loader2 className="h-14 w-14 text-primary animate-[spin_1.5s_linear_infinite]" />
          <div className="absolute top-0 left-0 h-14 w-14 border-t-2 border-primary rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" />
        </div>
        
        {/* Brand Text */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
            Arunodayata Saviyak
          </h2>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-slate-200" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
              Authenticating Session
            </p>
            <span className="h-px w-8 bg-slate-200" />
          </div>
        </div>
      </div>
      
      {/* Bottom Progress Bar Style Indicator */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-50 overflow-hidden">
        <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-1/3" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
