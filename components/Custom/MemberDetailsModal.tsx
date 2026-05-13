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
import { useUpdateMemberMutation } from "@/services/groupApi";
import { User, Phone, CreditCard, MapPin, Plus, Trash2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberDetailsModalProps {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberDetailsModal({ member, open, onOpenChange }: MemberDetailsModalProps) {
  const [guarantors, setGuarantors] = useState<any[]>([]);
  const updateMutation = useUpdateMemberMutation();

  useEffect(() => {
    if (member?.guarantors) {
      setGuarantors(member.guarantors);
    } else {
      setGuarantors([]);
    }
  }, [member]);

  const handleAddGuarantor = () => {
    if (guarantors.length < 2) {
      setGuarantors([...guarantors, { fullname: "", nic: "", phone: "", address: "" }]);
    }
  };

  const handleRemoveGuarantor = (index: number) => {
    setGuarantors(guarantors.filter((_, i) => i !== index));
  };

  const handleGuarantorChange = (index: number, field: string, value: string) => {
    const updated = [...guarantors];
    updated[index] = { ...updated[index], [field]: value };
    setGuarantors(updated);
  };

  const handleSave = () => {
    updateMutation.mutate({
      memberId: member.id,
      guarantors,
    }, {
      onSuccess: () => onOpenChange(false)
    });
  };

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
            <h4 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Guarantors ({guarantors.length}/2)
            </h4>
            {guarantors.length < 2 && (
              <Button size="sm" variant="outline" onClick={handleAddGuarantor} className="gap-2">
                <Plus className="w-4 h-4" /> Add Guarantor
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {guarantors.map((g, index) => (
              <div key={index} className="relative p-5 rounded-xl border bg-muted/20 space-y-4 shadow-inner">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   <Badge variant="secondary" className="font-bold">Guarantor {index + 1}</Badge>
                   <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemoveGuarantor(index)}>
                     <Trash2 className="w-4 h-4" />
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input 
                        className="pl-9 h-9 bg-background/50" 
                        value={g.fullname} 
                        onChange={(e) => handleGuarantorChange(index, "fullname", e.target.value)}
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">NIC Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input 
                        className="pl-9 h-9 bg-background/50" 
                        value={g.nic} 
                        onChange={(e) => handleGuarantorChange(index, "nic", e.target.value)}
                        placeholder="123456789V"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                      <Input 
                        className="pl-9 h-9 bg-background/50" 
                        value={g.phone} 
                        onChange={(e) => handleGuarantorChange(index, "phone", e.target.value)}
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Residential Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                      <Textarea 
                        className="pl-9 min-h-[60px] bg-background/50" 
                        value={g.address} 
                        onChange={(e) => handleGuarantorChange(index, "address", e.target.value)}
                        placeholder="123, Main Road, Colombo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {guarantors.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed rounded-xl bg-muted/10">
                <p className="text-muted-foreground">No guarantors added yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Member Details"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
