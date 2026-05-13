"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useCreateLoanMutation } from "@/services/loanApi";
import { useGroupsQuery } from "@/services/groupApi";
import { 
  Save, 
  ArrowLeft, 
  HandCoins, 
  Users, 
  CalendarDays, 
  CircleDollarSign,
  Info,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CreateLoanPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: groupsData, isLoading: groupsLoading } = useGroupsQuery({ limit: 100 });
  const createMutation = useCreateLoanMutation({
    onSuccess: () => {
      router.push("/loans");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.error || "Failed to create loan application");
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
      groupId: "",
      totalWeeks: 12,
      processingFee: 500,
      leaderLentAmount: 25000,
      leaderWeeklyAmount: 2200,
      memberLentAmount: 20000,
      memberWeeklyAmount: 1800,
    },
  });

  const selectedGroupId = watch("groupId");
  const selectedGroup = groupsData?.groups?.find((g: any) => g.id === selectedGroupId);

  const onSubmit = (data: any) => {
    setServerError(null);
    createMutation.mutate({
      ...data,
      totalWeeks: Number(data.totalWeeks),
      processingFee: Number(data.processingFee),
      leaderLentAmount: Number(data.leaderLentAmount),
      leaderWeeklyAmount: Number(data.leaderWeeklyAmount),
      memberLentAmount: Number(data.memberLentAmount),
      memberWeeklyAmount: Number(data.memberWeeklyAmount),
      createdBy: "system", // Should be from auth context
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Create New Loan"
        description="Submit a new group loan application for review and approval"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                {serverError}
              </div>
            )}

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Group Selection
                </CardTitle>
                <CardDescription>Select the group applying for this loan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Select Group</Label>
                  <Select
                    value={selectedGroupId}
                    onValueChange={(val) => setValue("groupId", val)}
                  >
                    <SelectTrigger className="bg-background/50 h-11">
                      <SelectValue placeholder="Choose a group..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groupsData?.groups?.map((group: any) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.branch})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.groupId && <p className="text-xs text-destructive">Please select a group</p>}
                </div>

                {selectedGroup && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{selectedGroup.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedGroup.branch} Branch | {selectedGroup._count?.members || 0} Members</p>
                    </div>
                    <Badge variant="outline" className="bg-background/80 font-bold">
                      Collection: {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][selectedGroup.collectionDay - 1]}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" /> Loan Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="totalWeeks">Duration (Weeks)</Label>
                  <Input
                    id="totalWeeks"
                    type="number"
                    className="bg-background/50 h-11"
                    {...register("totalWeeks", { required: true, min: 1 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="processingFee">Processing Fee (Rs.)</Label>
                  <Input
                    id="processingFee"
                    type="number"
                    className="bg-background/50 h-11"
                    {...register("processingFee", { required: true, min: 0 })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" /> Leader Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="leaderLentAmount">Lent Amount (Rs.)</Label>
                    <Input
                      id="leaderLentAmount"
                      type="number"
                      className="bg-background/50 h-11"
                      {...register("leaderLentAmount", { required: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="leaderWeeklyAmount">Weekly Payment (Rs.)</Label>
                    <Input
                      id="leaderWeeklyAmount"
                      type="number"
                      className="bg-background/50 h-11"
                      {...register("leaderWeeklyAmount", { required: true })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" /> Member Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="memberLentAmount">Lent Amount (Rs.)</Label>
                    <Input
                      id="memberLentAmount"
                      type="number"
                      className="bg-background/50 h-11"
                      {...register("memberLentAmount", { required: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="memberWeeklyAmount">Weekly Payment (Rs.)</Label>
                    <Input
                      id="memberWeeklyAmount"
                      type="number"
                      className="bg-background/50 h-11"
                      {...register("memberWeeklyAmount", { required: true })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                size="lg" 
                disabled={createMutation.isPending || !selectedGroupId}
                className="gap-2 w-full md:w-auto px-10 shadow-lg shadow-primary/20"
              >
                {createMutation.isPending ? "Creating..." : (
                  <>
                    <Save className="h-4 w-4" /> Submit Loan Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Summary/Preview */}
        <div className="w-full lg:w-80">
          <Card className="border-none shadow-xl bg-primary text-primary-foreground sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Group</span>
                  <span className="font-bold">{selectedGroup?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Duration</span>
                  <span className="font-bold">{watch("totalWeeks")} Weeks</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/20 pt-3">
                  <span className="opacity-80">Total Members</span>
                  <span className="font-bold">{selectedGroup?._count?.members || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Processing Fee</span>
                  <span className="font-bold">Rs. {watch("processingFee")}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-4">
                <div className="bg-white/10 p-3 rounded-lg space-y-1">
                  <p className="text-[10px] uppercase font-bold opacity-70">Total Loan Amount</p>
                  <p className="text-2xl font-bold">
                    Rs. {(selectedGroup ? (
                      Number(watch("leaderLentAmount")) + (Number(watch("memberLentAmount")) * (selectedGroup._count.members - 1))
                    ) : 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[10px] opacity-70 leading-tight">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  <p>Instalments will be generated automatically for each member upon submission.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
