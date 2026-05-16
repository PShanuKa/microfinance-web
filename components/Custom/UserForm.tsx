"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUserMutation, useUpdateUserMutation } from "@/services/userApi";
import { useState } from "react";

type FormValues = {
  id?: string;
  fullname: string;
  email: string;
  role: string;
  status: boolean;
  branch: string[];
};

interface UserFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ROLES = [
  "ADMIN",
  "BRANCH_MANAGER",
  "LOAN_OFFICER",
  "COLLECTION_OFFICER",
  "APPROVER",
  "AUDITOR",
];

export function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: initialData || {
      fullname: "",
      email: "",
      role: "LOAN_OFFICER",
      status: true,
      branch: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const createMutation = useCreateUserMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => handleApiError(error),
  });

  const updateMutation = useUpdateUserMutation({
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
      // For creation, we also need a default password if not provided
      createMutation.mutate({ ...data, password: "password123" });
    }
  };

  const selectedRole = watch("role");
  const selectedStatus = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
          {serverError}
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            placeholder="John Doe"
            {...register("fullname")}
            className={errors.fullname ? "border-destructive" : ""}
          />
          {errors.fullname && (
            <p className="text-xs text-destructive">{errors.fullname.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue("role", value || "LOAN_OFFICER")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={selectedStatus ? "active" : "inactive"}
              onValueChange={(value) => setValue("status", value === "active")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
