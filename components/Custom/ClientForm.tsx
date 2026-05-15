"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClientMutation, useUpdateClientMutation } from "@/services/clientApi";
import { useUploadAttachmentMutation } from "@/services/attachmentApi";
import { X, UploadCloud, Loader2 } from "lucide-react";
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
};

interface ClientFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.profileImage?.fileUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: initialData || {
      fullname: "",
      nic: "",
      phone: "",
      job: "",
      address: "",
      profileImageId: "",
    },
  });

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
      });
      if (initialData.profileImage?.fileUrl) {
        setPreviewUrl(initialData.profileImage.fileUrl);
      }
    }
  }, [initialData, reset]);

  const uploadMutation = useUploadAttachmentMutation();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to MinIO
    try {
      const response = await uploadMutation.mutateAsync(file);
      setValue("profileImageId", response.id);
    } catch (error) {
      setServerError("Failed to upload image. Please try again.");
      setPreviewUrl(null);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setValue("profileImageId", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    if (response?.fields) {
      Object.keys(response.fields).forEach((field: any) => {
        setError(field as any, { type: "manual", message: response.fields[field] });
      });
    } else {
      setServerError(response?.error || "An error occurred. Please try again.");
    }
  };

  const onSubmit = (data: FormValues) => {
    setServerError(null);
    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
          {serverError}
        </div>
      )}

      {/* Profile Image Upload */}
      <div className="flex flex-col items-center gap-4 pb-4 border-b">
        <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Profile Photo</Label>
        <div className="relative group">
          <div 
            className={cn(
              "w-32 h-32 rounded-[2rem] border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 shadow-inner",
              previewUrl ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50 bg-muted/20"
            )}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                <UploadCloud className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Upload Photo</span>
              </div>
            )}

            {uploadMutation.isPending && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          {previewUrl && !uploadMutation.isPending && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all hover:bg-rose-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploadMutation.isPending}
          />
          
          {!previewUrl && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 w-full h-full cursor-pointer"
            />
          )}
        </div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center max-w-[200px]">
          Click to upload. <br/><span className="text-primary opacity-60">Max size 2MB (JPG, PNG)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            placeholder="Enter client's full name"
            {...register("fullname")}
            className={cn("h-12 font-bold bg-background/50", errors.fullname ? "border-destructive" : "border-muted/50 focus:border-primary")}
          />
          {errors.fullname && <p className="text-xs text-destructive font-medium">{errors.fullname.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nic">NIC Number</Label>
          <Input
            id="nic"
            placeholder="e.g. 951234567V"
            {...register("nic")}
            className={cn("h-12 font-bold bg-background/50", errors.nic ? "border-destructive" : "border-muted/50 focus:border-primary")}
          />
          {errors.nic && <p className="text-xs text-destructive font-medium">{errors.nic.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="07XXXXXXXX"
            {...register("phone")}
            className={cn("h-12 font-bold bg-background/50", errors.phone ? "border-destructive" : "border-muted/50 focus:border-primary")}
          />
          {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="job">Job / Occupation</Label>
          <Input
            id="job"
            placeholder="e.g. Software Engineer, Farmer, Business"
            {...register("job")}
            className={cn("h-12 font-bold bg-background/50", errors.job ? "border-destructive" : "border-muted/50 focus:border-primary")}
          />
          {errors.job && <p className="text-xs text-destructive font-medium">{errors.job.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter residential address"
            className="min-h-[100px] font-bold bg-background/50"
            {...register("address")}
            autoComplete="street-address"
          />
          {errors.address && <p className="text-xs text-destructive font-medium">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-8 font-black uppercase tracking-widest text-[10px]">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending || uploadMutation.isPending}
          className="min-w-[180px] h-12 font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-xl transition-all"
        >
          {createMutation.isPending || updateMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </div>
          ) : initialData ? "Update Profile" : "Register Client"}
        </Button>
      </div>
    </form>
  );
}
