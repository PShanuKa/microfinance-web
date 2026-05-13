"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CreditCard, MapPin, Phone, User, Clock, Users, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ClientViewModalProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientViewModal({ client, open, onOpenChange }: ClientViewModalProps) {
  const router = useRouter();
  if (!client) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-emerald-500 hover:bg-emerald-600";
      case "INACTIVE": return "bg-amber-500 hover:bg-amber-600";
      case "BLACKLISTED": return "bg-rose-500 hover:bg-rose-600";
      default: return "bg-slate-500";
    }
  };

  const activeGroupMember = client.groupMembers?.[0];
  const activeGroup = activeGroupMember?.group;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden p-0">
        <div className="relative h-32 bg-primary/10 w-full">
           <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
           </div>
           <div className="absolute bottom-4 right-8">
              <Badge 
                className={cn(
                  "font-bold px-4 py-1.5 rounded-full text-sm shadow-md border-none text-white",
                  getStatusColor(client.status)
                )}
              >
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {client.status}
                </div>
              </Badge>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-6">
          <header className="space-y-1">
            <h2 className="text-3xl font-bold text-foreground">{client.fullname}</h2>
            <p className="text-sm text-muted-foreground font-medium font-mono">Client ID: {client.clientNo}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">NIC Number</p>
                  <p className="text-sm font-bold text-foreground">{client.nic}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Phone Number</p>
                  <p className="text-sm font-bold text-foreground">{client.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Job / Occupation</p>
                  <p className="text-sm font-bold text-foreground">{client.job || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Address</p>
                  <p className="text-sm font-bold text-foreground truncate max-w-[180px]">{client.address || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Group Info Section */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold">Assigned Group</h3>
              </div>
              {activeGroup && (
                <Badge variant="outline" className="bg-background/50 font-bold text-[10px]">
                  {activeGroup.branch}
                </Badge>
              )}
            </div>

            {activeGroup ? (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-primary">{activeGroup.name}</p>
                  <p className="text-[10px] text-muted-foreground">ID: {activeGroup.id}</p>
                </div>
                <button 
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/groups/${activeGroup.id}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                  View Group <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">This client is not currently assigned to any group.</p>
            )}
          </div>

          <div className="pt-6 border-t flex justify-end">
             <button 
               onClick={() => onOpenChange(false)}
               className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
             >
               Close Details
             </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
