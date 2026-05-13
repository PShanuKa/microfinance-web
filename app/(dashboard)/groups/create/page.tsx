"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PageHeader } from "@/components/Custom/PageHeader";
import { useCreateGroupMutation } from "@/services/groupApi";
import { useUsersQuery } from "@/services/userApi";
import { Save, ArrowLeft } from "lucide-react";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // Get officers (Loan Officers)
  const { data: userData } = useUsersQuery({ role: "LOAN_OFFICER", limit: 100 });
  const createMutation = useCreateGroupMutation({
    onSuccess: (data) => {
      router.push(`/groups/${data.group.id}/edit`);
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.error || "Failed to create group");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      branch: "",
      collectionDay: 1,
      officerId: "",
    },
  });

  const selectedDay = watch("collectionDay");
  const selectedOfficer = watch("officerId");

  const onSubmit = (data: any) => {
    // For demo, using a dummy createdBy. In real app, get from auth context.
    createMutation.mutate({
      ...data,
      collectionDay: Number(data.collectionDay),
      createdBy: "system", // Should be actual user ID
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4">
      <PageHeader
        title="Create New Group"
        description="Initialize a new microfinance group with a name, branch, and collection schedule"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <div className="flex justify-center">
        <Card className="w-full max-w-2xl border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Group Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {serverError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
                  {serverError}
                </div>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Sunlight Group"
                    {...register("name", { required: "Group name is required" })}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="e.g. Colombo North"
                    {...register("branch", { required: "Branch is required" })}
                    className={errors.branch ? "border-destructive" : ""}
                  />
                  {errors.branch && <p className="text-xs text-destructive">{errors.branch.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Collection Day</Label>
                    <Select
                      value={selectedDay.toString()}
                      onValueChange={(val) => setValue("collectionDay", Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day.id} value={day.id.toString()}>
                            {day.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Collection Officer</Label>
                    <Select
                      value={selectedOfficer}
                      onValueChange={(val) => setValue("officerId", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select officer" />
                      </SelectTrigger>
                      <SelectContent>
                        {userData?.users?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={createMutation.isPending} className="gap-2 w-full md:w-auto">
                  {createMutation.isPending ? "Creating..." : (
                    <>
                      <Save className="h-4 w-4" /> Save & Continue
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
