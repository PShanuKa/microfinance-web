"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  nic: z.string().regex(/^[0-9]{9}[vVxX]|[0-9]{12}$/, { message: "Invalid NIC format." }),
  mobile: z.string().min(10, { message: "Valid mobile number is required." }),
  job: z.string().min(2, { message: "Job/Occupation is required." }),
  address: z.string().min(5, { message: "Address is required." }),
});

type FormValues = z.infer<typeof formSchema>;

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientForm({ onSuccess, onCancel }: ClientFormProps) {
  const [photo, setPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      nic: "",
      mobile: "",
      job: "",
      address: "",
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", { ...data, photo });
    alert("Client Registered Successfully!");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative group">
          <div className={cn(
            "w-32 h-32 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden bg-muted/50 transition-all group-hover:border-primary",
            photo && "border-solid border-primary"
          )}>
            {photo ? (
              <img src={photo} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          {photo && (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handlePhotoChange}
          />
        </div>
        <Label className="text-sm font-medium text-muted-foreground">Client Photo</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter client's full name"
            className="bg-background/50"
            {...register("fullName")}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        {/* NIC */}
        <div className="space-y-2">
          <Label htmlFor="nic" className="text-sm font-semibold">NIC Number</Label>
          <Input
            id="nic"
            placeholder="e.g. 951234567V"
            className="bg-background/50"
            {...register("nic")}
          />
          {errors.nic && <p className="text-xs text-destructive">{errors.nic.message}</p>}
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <Label htmlFor="mobile" className="text-sm font-semibold">Phone Number</Label>
          <Input
            id="mobile"
            placeholder="07XXXXXXXX"
            className="bg-background/50"
            {...register("mobile")}
          />
          {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
        </div>

        {/* Job */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="job" className="text-sm font-semibold">Job / Occupation</Label>
          <Input
            id="job"
            placeholder="e.g. Software Engineer, Farmer, Business"
            className="bg-background/50"
            {...register("job")}
          />
          {errors.job && <p className="text-xs text-destructive">{errors.job.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter residential address"
            className="min-h-[80px] bg-background/50"
            {...register("address")}
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="w-32 shadow-lg shadow-primary/20">Register Client</Button>
      </div>
    </form>
  );
}
