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
import { useBranchesQuery } from "@/services/branchApi";
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

  // Get branches
  const { data: branchesData, isLoading: isLoadingBranches } = useBranchesQuery();
  const branches = branchesData?.branches || [];

  // Get officers (Loan Officers)
  const { data: userData } = useUsersQuery({ role: "LOAN_OFFICER", limit: 100 });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      branchId: "",
      location: "",
      collectionDay: 1,
      officerId: "",
    },
  });

  const handleApiError = (error: any) => {
    const response = error.response?.data;
    
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

  const createMutation = useCreateGroupMutation({
    onSuccess: (data: any) => {
      router.push(`/groups/${data.group.id}/edit`);
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });

  const selectedDay = watch("collectionDay");
  const selectedOfficer = watch("officerId");
  const selectedBranchId = watch("branchId");

  const onSubmit = (data: any) => {
    setServerError(null);
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
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>Branch</Label>
                  <Select
                    value={selectedBranchId || "none"}
                    onValueChange={(val) => setValue("branchId", val && val !== "none" ? val : "")}
                  >
                    <SelectTrigger className={errors.branchId ? "border-destructive" : ""}>
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
                  {errors.branchId && <p className="text-xs text-destructive">{errors.branchId.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location / Area</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Kaduwela, Malabe"
                    {...register("location")}
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && <p className="text-xs text-destructive">{errors.location.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Collection Day</Label>
                    <Select
                      value={selectedDay?.toString()}
                      onValueChange={(val) => setValue("collectionDay", Number(val))}
                    >
                      <SelectTrigger className={errors.collectionDay ? "border-destructive" : ""}>
                        <SelectValue>
                          {DAYS.find(d => d.id === Number(selectedDay))?.name || "Select day"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day.id} value={day.id.toString()}>
                            {day.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.collectionDay && <p className="text-xs text-destructive">{errors.collectionDay.message as string}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label>Collection Officer</Label>
                    <Select
                      value={selectedOfficer}
                      onValueChange={(val) => setValue("officerId", val || "")}
                    >
                      <SelectTrigger className={errors.officerId ? "border-destructive" : ""}>
                        <SelectValue>
                          {userData?.users?.find((u: any) => u.id === selectedOfficer)?.fullname || "Select officer"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {userData?.users?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.officerId && <p className="text-xs text-destructive">{errors.officerId.message as string}</p>}
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
