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
      <DialogContent className="sm:max-w-[800px] bg-card/95 backdrop-blur-lg border-none shadow-2xl overflow-hidden p-0">
        <DialogHeader className="p-8 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {guarantor.fullname || "Add New Guarantor"}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Verification for {member.client?.fullname}</span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">{member.client?.clientNo}</Badge>
              </div>
            </div>
            <Badge variant="secondary" className="font-black text-[10px] uppercase px-4 py-2 rounded-full bg-slate-900 text-white tracking-widest border-none">
              Slot {index + 1}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-primary" /> Identity Details
              </h4>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input 
                    id="fullname"
                    placeholder="Enter guarantor's full name" 
                    value={guarantor.fullname} 
                    onChange={(e) => handleFieldChange("fullname", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nic">NIC Number</Label>
                    <Input 
                      id="nic"
                      placeholder="e.g. 123456789V" 
                      value={guarantor.nic} 
                      onChange={(e) => handleFieldChange("nic", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      placeholder="e.g. 07XXXXXXXX" 
                      value={guarantor.phone} 
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <Textarea 
                    id="address"
                    placeholder="Enter full home address..." 
                    value={guarantor.address} 
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-primary" /> Verification Documents
              </h4>
              
              <div className="grid gap-4 p-6 rounded-2xl border bg-muted/10">
                {/* Profile Image Row */}
                <div className="flex items-center gap-6 p-4 bg-white border rounded-xl shadow-sm">
                   <div className="relative group shrink-0">
                      <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                         {getDocByType("PROFILE_IMAGE") ? (
                           <img src={getDocByType("PROFILE_IMAGE")?.fileUrl} className="w-full h-full object-cover" alt="Guarantor" />
                         ) : (
                           <Camera className="w-6 h-6 text-slate-400 group-hover:text-primary" />
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
                           <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h5 className="text-xs font-bold text-slate-800">Profile Photo</h5>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Clear face photo required</p>
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
                          "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer h-24",
                          doc ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:border-primary hover:bg-primary/5"
                        )}>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(type.id, e.target.files[0])}
                          />
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          ) : doc ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-[9px] font-bold uppercase text-emerald-700 tracking-tighter text-center line-clamp-1">{type.label} Uploaded</span>
                            </>
                          ) : (
                            <>
                              <type.icon className="w-4 h-4 text-slate-400" />
                              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">{type.label}</span>
                            </>
                          )}
                        </label>
                        {doc && (
                           <button 
                              onClick={(e) => {
                                e.preventDefault();
                                removeDocument(guarantor.documents.findIndex(d => d.type === type.id));
                              }}
                              className="absolute -top-1 -right-1 bg-white border shadow-sm rounded-full p-1 text-rose-500 hover:text-rose-600 transition-colors"
                           >
                             <X className="w-2.5 h-2.5" />
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

        <div className="p-8 border-t bg-muted/10 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="px-6 h-11 font-bold rounded-lg border-slate-200 hover:bg-white transition-all"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="px-8 h-11 font-bold shadow-lg transition-all"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                Saving...
              </>
            ) : initialGuarantor ? "Update Guarantor" : "Save Guarantor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
