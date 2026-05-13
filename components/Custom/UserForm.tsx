"use client";

import React from "react";
import { useForm } from "react-hook-form";
;
import * as z from "zod";
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

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string({ required_error: "Please select a role." }),
  branch: z.string({ required_error: "Please select a branch." }),
  status: z.string({ required_error: "Please select a status." }),
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      status: "Active",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("User Data:", data);
    alert("User Created Successfully!");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName" className="font-semibold text-sm">Full Name</Label>
          <Input id="fullName" placeholder="Enter full name" className="bg-background/50 h-11" {...register("fullName")} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email" className="font-semibold text-sm">Email Address</Label>
          <Input id="email" type="email" placeholder="example@microfinance.com" className="bg-background/50 h-11" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-sm">Role</Label>
          <Select onValueChange={(value) => setValue("role", value)}>
            <SelectTrigger className="bg-background/50 h-11">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="BranchManager">Branch Manager</SelectItem>
              <SelectItem value="LoanOfficer">Loan Officer</SelectItem>
              <SelectItem value="CollectionOfficer">Collection Officer</SelectItem>
              <SelectItem value="Auditor">Auditor</SelectItem>
              <SelectItem value="Approver">Approver</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="font-semibold text-sm">Branch</Label>
          <Select onValueChange={(value) => setValue("branch", value)}>
            <SelectTrigger className="bg-background/50 h-11">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Colombo">Colombo</SelectItem>
              <SelectItem value="Kandy">Kandy</SelectItem>
              <SelectItem value="Galle">Galle</SelectItem>
              <SelectItem value="Jaffna">Jaffna</SelectItem>
            </SelectContent>
          </Select>
          {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="font-semibold text-sm">Status</Label>
          <Select onValueChange={(value) => setValue("status", value)} defaultValue="Active">
            <SelectTrigger className="bg-background/50 h-11">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="w-32 shadow-lg shadow-primary/20">Create User</Button>
      </div>
    </form>
  );
}
