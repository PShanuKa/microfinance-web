"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CreditCard, MapPin, Phone, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientViewModalProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClientViewModal({ client, open, onOpenChange }: ClientViewModalProps) {
  if (!client) return null;

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
                variant={client.status === "Active" ? "default" : "destructive"}
                className={cn(
                  "font-bold px-4 py-1.5 rounded-full text-sm shadow-md",
                  client.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                )}
              >
                {client.status}
              </Badge>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-6">
          <header className="space-y-1">
            <h2 className="text-3xl font-bold text-foreground">{client.name}</h2>
            <p className="text-sm text-muted-foreground font-medium">Client ID: {client.id}</p>
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Job / Occupation</p>
                  <p className="text-sm font-bold text-foreground">{client.job}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Address</p>
                  <p className="text-sm font-bold text-foreground">Colombo, Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Guarantors</p>
                  <p className="text-sm font-bold text-foreground">{client.guarantors} Registered</p>
                </div>
              </div>
            </div>
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
