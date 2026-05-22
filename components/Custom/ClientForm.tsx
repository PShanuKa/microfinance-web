"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClientMutation, useUpdateClientMutation } from "@/services/clientApi";
import { useUploadAttachmentMutation } from "@/services/attachmentApi";
import { 
  X, 
  UploadCloud, 
  Loader2, 
  FileText, 
  Check, 
  Plus, 
  Trash2, 
  Camera,
  ShieldCheck, 
  History as HistoryIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

type FormValues = {
  id?: string;
  fullname: string;
  nic: string;
  phone: string;
  job: string;
  address: string;
  status?: string;
  profileImageId?: string;
  documents: Array<{ attachmentId: string; type: string; fileUrl?: string; fileName?: string }>;
};

interface ClientFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DOCUMENT_TYPES = [
  { id: "NIC_FRONT", label: "NIC Front Copy", description: "Clear photo of the front side" },
  { id: "NIC_BACK", label: "NIC Back Copy", description: "Clear photo of the back side" },
  { id: "ADDRESS_PROOF", label: "Proof of Address", description: "Utility bill or GS certificate" },
  { id: "BILLING_PROOF", label: "Billing Proof", description: "Electricity or Water bill" },
];

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(initialData?.profileImage?.fileUrl || null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      fullname: "",
      nic: "",
      phone: "",
      job: "",
      address: "",
      status: "ACTIVE",
      profileImageId: "",
      documents: [],
    },
  });

  const { append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedDocuments = watch("documents");

  useEffect(() => {
    if (initialData) {
      reset({
        fullname: initialData.fullname || "",
        nic: initialData.nic || "",
        phone: initialData.phone || "",
        job: initialData.job || "",
        address: initialData.address || "",
        status: initialData.status || "ACTIVE",
        profileImageId: initialData.profileImageId || "",
        documents: initialData.documents?.map((doc: any) => ({
          attachmentId: doc.attachmentId,
          type: doc.type,
          fileUrl: doc.attachment?.fileUrl,
          fileName: doc.attachment?.fileName,
        })) || [],
      });
      if (initialData.profileImage?.fileUrl) {
        setProfilePreview(initialData.profileImage.fileUrl);
      }
    }
  }, [initialData, reset]);

  const uploadMutation = useUploadAttachmentMutation();

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePreview(URL.createObjectURL(file));

    try {
      const response = await uploadMutation.mutateAsync({ file, category: "client" });
      setValue("profileImageId", response.id);
    } catch (error) {
      setServerError("Failed to upload profile photo.");
      setProfilePreview(null);
    }
  };

  const handleDocumentUpload = async (file: File, type: string) => {
    try {
      const response = await uploadMutation.mutateAsync({ file, category: "client" });
      
      const existingIdx = watchedDocuments.findIndex(doc => doc.type === type && type !== "OTHER");
      
      if (existingIdx !== -1) {
        setValue(`documents.${existingIdx}`, {
          attachmentId: response.id,
          type: type,
          fileUrl: response.link,
          fileName: file.name
        });
      } else {
        append({
          attachmentId: response.id,
          type: type,
          fileUrl: response.link,
          fileName: file.name,
        });
      }
    } catch (error) {
      setServerError(`Failed to upload ${type.toLowerCase().replace("_", " ")}.`);
    }
  };

  const removeDocument = (index: number) => {
    remove(index);
  };

  const getDocByType = (type: string) => {
    return watchedDocuments.find(doc => doc.type === type);
  };

  const createMutation = useCreateClientMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => handleApiError(error),
  });

  const updateMutation = useUpdateClientMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => handleApiError(error),
  });

  const handleApiError = (error: any) => {
    const response = error.response?.data;
    
    // Always show the top-level error message if it exists
    if (response?.error) {
      setServerError(response.error);
    }

    if (response?.fields) {
      Object.keys(response.fields).forEach((field: any) => {
        setError(field as any, { type: "manual", message: response.fields[field] });
      });
    } else if (!response?.error) {
      setServerError("An error occurred. Please try again.");
    }
  };

  const onSubmit = (data: FormValues) => {
    setServerError(null);
    const payload = {
      ...data,
      documents: data.documents.map(({ attachmentId, type }) => ({ attachmentId, type })),
    };

    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
          {serverError}
        </div>
      )}

      {/* Section 1: Basic Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase text-[12px]">Basic Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className={cn(
                "w-40 h-40 rounded-[2.5rem] border-4 border-dashed flex items-center justify-center overflow-hidden transition-all duration-500 shadow-2xl bg-muted/30",
                profilePreview ? "border-primary/40 bg-primary/5" : "border-slate-200 hover:border-primary/40"
              )}>
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-primary transition-colors">
                    <Camera className="w-10 h-10 mb-2 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                  </div>
                )}
                {uploadMutation.isPending && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 rounded-full shadow-xl bg-white hover:bg-primary hover:text-white transition-all border-2"
                onClick={() => profileInputRef.current?.click()}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">
              Client Portrait <br/><span className="text-primary opacity-60">JPG/PNG preferred</span>
            </p>
          </div>

          {/* Text Inputs */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="Enter complete legal name"
                {...register("fullname")}
                className={errors.fullname ? "border-destructive" : ""}
              />
              {errors.fullname && <p className="text-xs text-destructive">{errors.fullname.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nic">NIC Number</Label>
              <Input
                id="nic"
                placeholder="National ID Number"
                {...register("nic")}
                className={errors.nic ? "border-destructive" : ""}
              />
              {errors.nic && <p className="text-xs text-destructive">{errors.nic.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="07XXXXXXXX"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="job">Job / Occupation</Label>
              <Input
                id="job"
                placeholder="Current employment"
                {...register("job")}
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Residential address"
                className="min-h-[100px]"
                {...register("address")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Required Documents */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase text-[12px]">Verification Documents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOCUMENT_TYPES.map((docType) => {
            const doc = getDocByType(docType.id);
            return (
              <div 
                key={docType.id}
                className={cn(
                  "relative p-5 rounded-2xl border-2 border-dashed transition-all duration-300 group",
                  doc ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-200 hover:border-primary/30 bg-muted/10 hover:bg-muted/20"
                )}
              >
                <div className="flex flex-col h-full justify-between gap-4">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-tight text-slate-800 mb-1">{docType.label}</h3>
                    <p className="text-[9px] font-medium text-muted-foreground leading-tight">{docType.description}</p>
                  </div>

                  {doc ? (
                    <div className="flex items-center justify-between gap-2 bg-white/80 p-2 rounded-lg border shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-bold truncate">{doc.fileName}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeDocument(watchedDocuments.indexOf(doc))}
                        className="p-1.5 hover:bg-rose-100 rounded-md text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        className="w-full h-10 rounded-xl bg-background border shadow-sm group-hover:border-primary/30 transition-all font-bold text-[10px] uppercase gap-2"
                        disabled={uploadMutation.isPending}
                      >
                        <UploadCloud className="w-4 h-4" />
                        Select File
                      </Button>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(file, docType.id);
                        }}
                        disabled={uploadMutation.isPending}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Others */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <HistoryIcon className="w-4 h-4 text-slate-500" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase text-[12px]">Additional Attachments</h2>
          </div>
          <div className="relative">
            <Button type="button" size="sm" variant="outline" className="gap-2 h-8 font-black uppercase text-[9px] tracking-widest border-2">
              <Plus className="w-3 h-3" /> Add Other
            </Button>
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  Array.from(files).forEach(file => handleDocumentUpload(file, "OTHER"));
                }
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {watchedDocuments.filter(doc => doc.type === "OTHER").map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-card hover:border-primary/30 transition-all group shadow-sm">
               <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[11px] font-black text-slate-800 truncate">{doc.fileName}</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Other Document</span>
                  </div>
               </div>
               <button 
                  type="button"
                  onClick={() => removeDocument(watchedDocuments.indexOf(doc))}
                  className="p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg transition-all"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          ))}
          {watchedDocuments.filter(doc => doc.type === "OTHER").length === 0 && (
            <div className="col-span-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center opacity-40">
              <UploadCloud className="w-8 h-8 mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">No additional documents</p>
            </div>
          )}
        </div>
        {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
          {serverError}
        </div>
      )}
      </section>

      <div className="flex justify-end gap-3 pt-10 border-t-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="h-14 px-10 font-black uppercase tracking-widest text-[11px] border-2"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
          className="min-w-[220px] h-14 font-black uppercase tracking-widest text-[11px] shadow-2xl hover:translate-y-[-2px] transition-all"
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </div>
          ) : initialData ? "Update Profile & Documents" : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
}
