"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Camera, 
  UploadCloud, 
  FileText, 
  Trash2, 
  Loader2,
  X
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useUploadAttachmentMutation } from "@/services/attachmentApi";
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
}

interface LoanGuarantorsModalProps {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: number; // 0 or 1
  initialGuarantor: Guarantor | null;
  onSave: (guarantor: Guarantor, index: number) => void;
  isSaving?: boolean;
}

const DOCUMENT_TYPES = [
  { id: "NIC_FRONT", label: "NIC Front", icon: CreditCard },
  { id: "NIC_BACK", label: "NIC Back", icon: CreditCard },
  { id: "ADDRESS_PROOF", label: "Address Proof", icon: MapPin },
  { id: "BILLING_PROOF", label: "Billing Proof", icon: FileText },
  { id: "OTHER", label: "Other Docs", icon: FileText },
];

export function LoanGuarantorsModal({ 
  member, 
  open, 
  onOpenChange, 
  index,
  initialGuarantor, 
  onSave,
  isSaving = false 
}: LoanGuarantorsModalProps) {
  const [guarantor, setGuarantor] = useState<Guarantor>({ fullname: "", nic: "", phone: "", address: "", documents: [] });
  const uploadMutation = useUploadAttachmentMutation();
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialGuarantor) {
        setGuarantor({
          ...initialGuarantor,
          documents: initialGuarantor.documents || []
        });
      } else {
        setGuarantor({ fullname: "", nic: "", phone: "", address: "", documents: [] });
      }
    }
  }, [open, initialGuarantor]);

  const handleFieldChange = (field: keyof Guarantor, value: any) => {
    setGuarantor(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (type: string, file: File) => {
    setUploadingType(type);
    try {
      const response = await uploadMutation.mutateAsync(file);
      const currentDocs = [...(guarantor.documents || [])];
      
      const existingIdx = currentDocs.findIndex(doc => doc.type === type && type !== "OTHER");
      const newDoc = {
        attachmentId: response.id,
        type: type,
        fileUrl: response.link,
        fileName: file.name
      };

      if (existingIdx !== -1) {
        currentDocs[existingIdx] = newDoc;
      } else {
        currentDocs.push(newDoc);
      }

      setGuarantor(prev => ({ ...prev, documents: currentDocs }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingType(null);
    }
  };

  const removeDocument = (docIndex: number) => {
    setGuarantor(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== docIndex)
    }));
  };

  const getDocByType = (type: string) => {
    return guarantor.documents.find(d => d.type === type);
  };

  const handleSave = () => {
    onSave(guarantor, index);
  };

  const isComplete = guarantor.fullname && guarantor.nic && guarantor.phone && guarantor.address;

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card/95 backdrop-blur-xl border-none shadow-2xl overflow-hidden p-0">
        <div className="bg-primary/5 p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-background shadow-sm">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">{member.client?.fullname}</h3>
                <Badge variant="secondary" className="font-black text-xs uppercase px-4 py-1.5 rounded-full bg-slate-900 text-white">Guarantor {index + 1}</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono text-[10px]">{member.client?.clientNo}</Badge>
                <span>{member.client?.nic}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="relative p-8 rounded-3xl border bg-muted/20 space-y-8 shadow-inner border-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Identity Details</h4>
              </div>
              {isComplete && (
                 <Badge className="bg-emerald-500 text-white gap-1.5 py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
                   <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Save
                 </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold" 
                      value={guarantor.fullname} 
                      onChange={(e) => handleFieldChange("fullname", e.target.value)}
                      placeholder="Sunil Perera"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">NIC Number</Label>
                    <div className="relative group">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold" 
                        value={guarantor.nic} 
                        onChange={(e) => handleFieldChange("nic", e.target.value)}
                        placeholder="123456789V"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Phone Number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        className="pl-12 h-12 bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold" 
                        value={guarantor.phone} 
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        placeholder="07XXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Residential Address</Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Textarea 
                      className="pl-12 min-h-[100px] bg-white border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 transition-all font-bold resize-none" 
                      value={guarantor.address} 
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      placeholder="Enter full home address..."
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-1">Verification Documents</Label>
                
                {/* Profile Image - Circular Upload */}
                <div className="flex items-center gap-6 p-4 bg-white border rounded-2xl border-slate-200 shadow-sm mb-4">
                   <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                         {getDocByType("PROFILE_IMAGE") ? (
                           <img src={getDocByType("PROFILE_IMAGE")?.fileUrl} className="w-full h-full object-cover" alt="Guarantor" />
                         ) : (
                           <Camera className="w-8 h-8 text-slate-400 group-hover:text-primary" />
                         )}
                      </div>
                      <label className="absolute inset-0 cursor-pointer">
                         <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload("PROFILE_IMAGE", e.target.files[0])}
                         />
                      </label>
                      {uploadingType === "PROFILE_IMAGE" && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full">
                           <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h5 className="text-sm font-black text-slate-800">Profile Photo</h5>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Clear face photo required</p>
                   </div>
                   {getDocByType("PROFILE_IMAGE") && (
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-rose-500 hover:bg-rose-50 h-8 w-8"
                        onClick={() => removeDocument(guarantor.documents.findIndex(d => d.type === "PROFILE_IMAGE"))}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {DOCUMENT_TYPES.map((type) => {
                    const doc = getDocByType(type.id);
                    const isUploading = uploadingType === type.id;
                    
                    return (
                      <div key={type.id} className="relative">
                        <label className={cn(
                          "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed transition-all cursor-pointer h-[100px]",
                          doc ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 hover:border-primary hover:bg-primary/5"
                        )}>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(type.id, e.target.files[0])}
                          />
                          {isUploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          ) : doc ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              <span className="text-[9px] font-black uppercase text-emerald-700 tracking-tighter text-center line-clamp-1">{type.label} Uploaded</span>
                            </>
                          ) : (
                            <>
                              <type.icon className="w-5 h-5 text-slate-400" />
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">{type.label}</span>
                            </>
                          )}
                        </label>
                        {doc && (
                           <button 
                              onClick={(e) => {
                                e.preventDefault();
                                removeDocument(guarantor.documents.findIndex(d => d.type === type.id));
                              }}
                              className="absolute -top-2 -right-2 bg-white border shadow-md rounded-full p-1 text-rose-500 hover:text-rose-600 transition-colors"
                           >
                             <X className="w-3 h-3" />
                           </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-slate-50/50 flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="px-8 h-12 font-bold rounded-xl border-slate-200 hover:bg-white transition-all"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="px-12 h-12 font-black shadow-xl shadow-primary/30 rounded-xl transition-all bg-slate-900 hover:bg-slate-800"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                Saving Data...
              </>
            ) : `Confirm & Save Guarantor ${index + 1}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
