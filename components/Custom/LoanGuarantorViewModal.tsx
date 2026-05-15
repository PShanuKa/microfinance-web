"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  FileText,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GuarantorDocument {
  attachmentId: string;
  type: string;
  fileUrl?: string;
  fileName?: string;
}

interface Guarantor {
  id?: string;
  fullname: string;
  nic: string;
  phone: string;
  address: string;
  documents: GuarantorDocument[];
  index: number;
}

interface LoanGuarantorViewModalProps {
  guarantor: Guarantor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
}

const DOCUMENT_TYPES = [
  { id: "NIC_FRONT", label: "NIC Front" },
  { id: "NIC_BACK", label: "NIC Back" },
  { id: "ADDRESS_PROOF", label: "Address Proof" },
  { id: "BILLING_PROOF", label: "Billing Proof" },
  { id: "OTHER", label: "Other Document" },
];

export function LoanGuarantorViewModal({ guarantor, open, onOpenChange, memberName }: LoanGuarantorViewModalProps) {
  if (!guarantor) return null;

  const getDocByType = (type: string) => {
    return guarantor.documents.find(d => d.type === type);
  };

  const profileImg = getDocByType("PROFILE_IMAGE");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden p-0">
        <DialogHeader className="p-8 border-b bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-primary/10 shadow-xl flex items-center justify-center overflow-hidden">
                {profileImg ? (
                  <img src={profileImg.fileUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary/40" />
                )}
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase">
                  {guarantor.fullname}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Guarantor for {memberName}</span>
                </div>
              </div>
            </div>
            <Badge className="font-black text-[10px] uppercase px-4 py-2 rounded-full bg-slate-900 text-white tracking-widest border-none">
              Slot {guarantor.index + 1}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Identity Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">NIC Number</span>
                <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <CreditCard className="w-5 h-5 text-primary/60" />
                  {guarantor.nic}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</span>
                <div className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <Phone className="w-5 h-5 text-primary/60" />
                  {guarantor.phone}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Residential Address</span>
              <div className="flex gap-3 text-sm font-bold text-slate-600 leading-relaxed">
                <MapPin className="w-5 h-5 text-primary/60 shrink-0 mt-1" />
                {guarantor.address}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-slate-100"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-4">Verification Documents</span>
                <div className="h-px flex-1 bg-slate-100"></div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {DOCUMENT_TYPES.map((type) => {
                  const doc = getDocByType(type.id);
                  return (
                    <div key={type.id} className={cn(
                      "group relative rounded-2xl border-2 transition-all p-1 overflow-hidden h-40",
                      doc ? "bg-white border-slate-100 hover:border-primary/30" : "bg-slate-50/50 border-slate-100 border-dashed opacity-50"
                    )}>
                      {doc ? (
                        <>
                          <img src={doc.fileUrl} className="w-full h-full object-cover rounded-xl" alt={type.label} />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                             <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 p-2 rounded-full shadow-xl hover:scale-110 transition-transform">
                                <Eye className="w-5 h-5" />
                             </a>
                             <span className="text-white text-[10px] font-bold mt-2 uppercase tracking-widest">{type.label}</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                           <FileText className="w-6 h-6 text-slate-300" />
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">{type.label} Not Available</span>
                        </div>
                      )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Identity Record</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
