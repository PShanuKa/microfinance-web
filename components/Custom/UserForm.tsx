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
import { useBranchesQuery } from "@/services/branchApi";
import { useState } from "react";

type FormValues = {
  id?: string;
  fullname: string;
  email: string;
  roles: string[];
  status: boolean;
  branchId?: string;
  password?: string;
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
  "MORTGAGE_OFFICER",
  "MORTGAGE_COLLECTION",
];

export function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { data: branchesData, isLoading: isLoadingBranches } = useBranchesQuery();
  const branches = branchesData?.branches || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      fullname: "",
      email: "",
      roles: ["LOAN_OFFICER"],
      status: true,
      branchId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullname: initialData.fullname || "",
        email: initialData.email || "",
        roles: initialData.roles || ["LOAN_OFFICER"],
        status: initialData.status !== undefined ? initialData.status : true,
        branchId: initialData.branchId || initialData.branch?.id || "",
      });
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
      // For creation, we also need a password, use provided or default
      createMutation.mutate({ ...data, password: data.password || "password123" });
    }
  };

  const selectedRoles = watch("roles") || [];
  const selectedStatus = watch("status");
  const selectedBranchId = watch("branchId");

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

        {!initialData && (
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password (default: password123)"
              {...register("password")}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <Label>Branch</Label>
          <Select
            value={selectedBranchId || "none"}
            onValueChange={(value) => setValue("branchId", value && value !== "none" ? value : undefined)}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedBranchId && selectedBranchId !== "none"
                  ? (branches.find((b: any) => b.id === selectedBranchId)?.name || "Select branch")
                  : "None / No Branch"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None / No Branch</SelectItem>
              {branches.map((b: any) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2 col-span-2">
            <Label>Roles</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-md">
              {ROLES.map((role) => (
                <label key={role} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                    checked={selectedRoles.includes(role)}
                    onChange={(e) => {
                      const currentRoles = watch("roles") || [];
                      if (e.target.checked) {
                        setValue("roles", [...currentRoles, role], { shouldValidate: true });
                      } else {
                        setValue(
                          "roles",
                          currentRoles.filter((r) => r !== role),
                          { shouldValidate: true }
                        );
                      }
                    }}
                  />
                  <span className="text-sm font-medium">{role.replace("_", " ")}</span>
                </label>
              ))}
            </div>
            {errors.roles && (
              <p className="text-xs text-destructive">{errors.roles.message}</p>
            )}
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
