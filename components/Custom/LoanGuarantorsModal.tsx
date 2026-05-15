"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, CreditCard, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface Guarantor {
  fullname: string;
  nic: string;
  phone: string;
  address: string;
}

interface LoanGuarantorsModalProps {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGuarantors: Guarantor[];
  onSave: (guarantors: Guarantor[]) => void;
}

export function LoanGuarantorsModal({ member, open, onOpenChange, initialGuarantors, onSave }: LoanGuarantorsModalProps) {
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);

  useEffect(() => {
    if (open) {
      if (initialGuarantors && initialGuarantors.length > 0) {
        setGuarantors(initialGuarantors);
      } else {
        setGuarantors([
          { fullname: "", nic: "", phone: "", address: "" },
          { fullname: "", nic: "", phone: "", address: "" }
        ]);
      }
    }
  }, [open, initialGuarantors]);

  const handleGuarantorChange = (index: number, field: keyof Guarantor, value: string) => {
    const updated = [...guarantors];
    updated[index] = { ...updated[index], [field]: value };
    setGuarantors(updated);
  };

  const handleSave = () => {
    onSave(guarantors);
    onOpenChange(false);
  };

  const isComplete = guarantors.every(g => g.fullname && g.nic && g.phone && g.address);

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-primary/5 p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-sm">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{member.client?.fullname}</h3>
              <p className="text-sm text-muted-foreground font-mono">{member.client?.clientNo} | {member.client?.nic}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Member Guarantors
            </h4>
            {isComplete && (
               <Badge className="bg-emerald-500 text-white gap-1 py-1">
                 <CheckCircle2 className="w-3 h-3" /> All Data Entered
               </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {guarantors.map((g, index) => (
              <div key={index} className="relative p-6 rounded-2xl border bg-muted/20 space-y-5 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                   <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-widest px-3">Guarantor {index + 1}</Badge>
                   <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-muted-foreground tracking-tighter">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10 h-11 bg-background/80 focus:bg-background transition-colors" 
                        value={g.fullname} 
                        onChange={(e) => handleGuarantorChange(index, "fullname", e.target.value)}
                        placeholder="e.g. Sunil Perera"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-muted-foreground tracking-tighter">NIC Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10 h-11 bg-background/80 focus:bg-background transition-colors" 
                        value={g.nic} 
                        onChange={(e) => handleGuarantorChange(index, "nic", e.target.value)}
                        placeholder="123456789V"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase font-black text-muted-foreground tracking-tighter">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        className="pl-10 h-11 bg-background/80 focus:bg-background transition-colors" 
                        value={g.phone} 
                        onChange={(e) => handleGuarantorChange(index, "phone", e.target.value)}
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase font-black text-muted-foreground tracking-tighter">Residential Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea 
                        className="pl-10 min-h-[80px] bg-background/80 focus:bg-background transition-colors" 
                        value={g.address} 
                        onChange={(e) => handleGuarantorChange(index, "address", e.target.value)}
                        placeholder="Full home address..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6 font-bold">Cancel</Button>
          <Button onClick={handleSave} className="px-10 font-black shadow-lg shadow-primary/20">
            Confirm Guarantors
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
