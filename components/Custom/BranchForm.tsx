"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBranchMutation, useUpdateBranchMutation } from "@/services/branchApi";

type FormValues = {
  name: string;
  address: string;
};

interface BranchFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BranchForm({ initialData, onSuccess, onCancel }: BranchFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        address: initialData.address || "",
      });
    }
  }, [initialData, reset]);

  const createMutation = useCreateBranchMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => handleApiError(error),
  });

  const updateMutation = useUpdateBranchMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => handleApiError(error),
  });

  const handleApiError = (error: any) => {
    const response = error.response?.data;
    if (response?.fields) {
      Object.keys(response.fields).forEach((field: any) => {
        setError(field, { type: "manual", message: response.fields[field] });
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

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Branch Name</Label>
          <Input
            id="name"
            placeholder="e.g. Balangoda Branch"
            {...register("name", {
              required: "Branch name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" },
            })}
            className={errors.name ? "border-destructive rounded-xl h-11" : "rounded-xl h-11"}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Branch Address</Label>
          <Textarea
            id="address"
            placeholder="e.g. No 45, Main Street, Balangoda"
            {...register("address", {
              required: "Branch address is required",
              minLength: { value: 5, message: "Address must be at least 5 characters" },
            })}
            className={errors.address ? "border-destructive rounded-xl min-h-[100px]" : "rounded-xl min-h-[100px]"}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="font-bold rounded-xl">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
          className="font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800"
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : initialData ? "Update Branch" : "Create Branch"}
        </Button>
      </div>
    </form>
  );
}
