"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  nic: z
    .string()
    .regex(/^[0-9]{9}[vVxX]|[0-9]{12}$/, { message: "Invalid NIC format." }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits." }),
  gender: z.string().min(1, "Please select a gender."),
  center: z.string().min(1, "Please select a center."),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export function SampleForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      nic: "",
      mobile: "",
      address: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
    alert("Form submitted successfully!");
  };

  return (
    <Card className="w-full max-w-2xl border-none shadow-2xl bg-card/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          New Client Registration
        </CardTitle>
        <CardDescription>
          Fill in the details below to register a new client in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                className="bg-background/50 focus:ring-2 focus:ring-primary/20"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* NIC */}
            <div className="space-y-2">
              <Label htmlFor="nic" className="text-sm font-semibold">
                NIC Number
              </Label>
              <Input
                id="nic"
                placeholder="Enter NIC (e.g. 123456789V)"
                className="bg-background/50 focus:ring-2 focus:ring-primary/20"
                {...register("nic")}
              />
              {errors.nic && (
                <p className="text-xs text-destructive font-medium">
                  {errors.nic.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-semibold">
                Mobile Number
              </Label>
              <Input
                id="mobile"
                placeholder="07XXXXXXXX"
                className="bg-background/50 focus:ring-2 focus:ring-primary/20"
                {...register("mobile")}
              />
              {errors.mobile && (
                <p className="text-xs text-destructive font-medium">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Gender</Label>
              <Select onValueChange={(value: string | null) => setValue("gender", value || "")}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-destructive font-medium">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Center */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold">Assigned Center</Label>
              <Select onValueChange={(value: string | null) => setValue("center", value || "")}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colombo-north">Colombo North</SelectItem>
                  <SelectItem value="colombo-south">Colombo South</SelectItem>
                  <SelectItem value="kaduwela">Kaduwela</SelectItem>
                  <SelectItem value="malabe">Malabe</SelectItem>
                  <SelectItem value="battaramulla">Battaramulla</SelectItem>
                </SelectContent>
              </Select>
              {errors.center && (
                <p className="text-xs text-destructive font-medium">
                  {errors.center.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-sm font-semibold">
                Home Address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter complete residential address"
                className="min-h-[100px] bg-background/50 focus:ring-2 focus:ring-primary/20"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" className="w-32">
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-32 shadow-lg shadow-primary/20 transition-all hover:scale-105"
            >
              Register
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
