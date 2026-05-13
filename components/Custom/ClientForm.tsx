"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClientMutation, useUpdateClientMutation } from "@/services/clientApi";
import { useState } from "react";

type FormValues = {
  id?: string;
  fullname: string;
  nic: string;
  phone: string;
  job: string;
  address: string;
  status?: string;
};

interface ClientFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ClientForm({ initialData, onSuccess, onCancel }: ClientFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: initialData || {
      fullname: "",
      nic: "",
      phone: "",
      job: "",
      address: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            placeholder="Enter client's full name"
            {...register("fullname")}
            className={errors.fullname ? "border-destructive" : ""}
          />
          {errors.fullname && <p className="text-xs text-destructive">{errors.fullname.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nic">NIC Number</Label>
          <Input
            id="nic"
            placeholder="e.g. 951234567V"
            {...register("nic")}
            className={errors.nic ? "border-destructive" : ""}
          />
          {errors.nic && <p className="text-xs text-destructive">{errors.nic.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="07XXXXXXXX"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="job">Job / Occupation</Label>
          <Input
            id="job"
            placeholder="e.g. Software Engineer, Farmer, Business"
            {...register("job")}
            className={errors.job ? "border-destructive" : ""}
          />
          {errors.job && <p className="text-xs text-destructive">{errors.job.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter residential address"
            className="min-h-[80px]"
            {...register("address")}
            autoComplete="street-address"
          />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="min-w-[120px]"
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : initialData ? "Update Client" : "Register Client"}
        </Button>
      </div>
    </form>
  );
}
