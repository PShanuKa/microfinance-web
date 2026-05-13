"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
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
import { useLoanQuery, useUpdateLoanScheduleMutation } from "@/services/loanApi";
import { useGroupsQuery } from "@/services/groupApi";
import { 
  Save, 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  CircleDollarSign,
  Info,
  Crown,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EditLoanSchedulePage() {
  const router = useRouter();
  const { id } = useParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: groupsData } = useGroupsQuery({ limit: 100 });
  const { data: loanData, isLoading: loanLoading } = useLoanQuery(id as string);
  const updateMutation = useUpdateLoanScheduleMutation({
    onSuccess: () => {
      router.push("/loans");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.error || "Failed to update loan schedule");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groupId: "",
      totalWeeks: 0,
      processingFee: 0,
      leaderLentAmount: 0,
      leaderWeeklyAmount: 0,
      memberLentAmount: 0,
      memberWeeklyAmount: 0,
    },
  });

  useEffect(() => {
    if (loanData?.loan) {
      reset({
        groupId: loanData.loan.groupId,
        totalWeeks: loanData.loan.totalWeeks,
        processingFee: Number(loanData.loan.processingFee),
        leaderLentAmount: Number(loanData.loan.leaderLentAmount),
        leaderWeeklyAmount: Number(loanData.loan.leaderWeeklyAmount),
        memberLentAmount: Number(loanData.loan.memberLentAmount),
        memberWeeklyAmount: Number(loanData.loan.memberWeeklyAmount),
      });
    }
  }, [loanData, reset]);

  const selectedGroupId = watch("groupId");
  const selectedGroup = groupsData?.groups?.find((g: any) => g.id === selectedGroupId);

  const onSubmit = (data: any) => {
    setServerError(null);
    updateMutation.mutate({
      id: id as string,
      data: {
        groupId: data.groupId,
        totalWeeks: Number(data.totalWeeks),
        processingFee: Number(data.processingFee),
        leaderLentAmount: Number(data.leaderLentAmount),
        leaderWeeklyAmount: Number(data.leaderWeeklyAmount),
        memberLentAmount: Number(data.memberLentAmount),
        memberWeeklyAmount: Number(data.memberWeeklyAmount),
      }
    });
  };

  if (loanLoading) return <div className="p-10 text-center text-muted-foreground font-medium">Loading loan details...</div>;

  const watchWeeks = watch("totalWeeks");
  const watchLeaderLent = watch("leaderLentAmount");
  const watchMemberLent = watch("memberLentAmount");
  const watchLeaderWeekly = watch("leaderWeeklyAmount");
  const watchMemberWeekly = watch("memberWeeklyAmount");

  const totalMembers = selectedGroup?._count?.members || 0;
  const totalPrincipal = Number(watchLeaderLent) + (Number(watchMemberLent) * Math.max(0, totalMembers - 1));
  const weeklyTotal = Number(watchLeaderWeekly) + (Number(watchMemberWeekly) * Math.max(0, totalMembers - 1));

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title={`Edit Loan Application: ${loanData?.loan?.id}`}
        description="Modify all loan parameters and regenerate instalments"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-4 text-amber-700 animate-in fade-in slide-in-from-top-2">
        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold">Caution: Full Update</p>
          <p className="opacity-90 font-medium">Changing the group or amounts will completely regenerate the repayment schedule for all members.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
                {serverError}
              </div>
            )}

            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Group Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Change Group</Label>
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
                </div>

                {selectedGroup && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{selectedGroup.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedGroup.branch} Branch | {selectedGroup._count?.members || 0} Members</p>
                    </div>
                    <Badge variant="outline" className="bg-background/80 font-bold">
                      Collection Day: {selectedGroup.collectionDay}
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
                disabled={updateMutation.isPending}
                className="gap-2 w-full md:w-auto px-10 shadow-lg shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-700"
              >
                {updateMutation.isPending ? "Updating..." : (
                  <>
                    <Save className="h-4 w-4" /> Save All Changes
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
                <CircleDollarSign className="w-5 h-5" /> Live Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Group</span>
                  <span className="font-bold text-right">{selectedGroup?.name || "..."}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Duration</span>
                  <span className="font-bold">{watchWeeks} Weeks</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/20 pt-3">
                  <span className="opacity-80">Total Principal</span>
                  <span className="font-bold">Rs. {totalPrincipal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Weekly Total</span>
                  <span className="font-bold">Rs. {weeklyTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Total Return</span>
                  <span className="font-bold">Rs. {(weeklyTotal * Number(watchWeeks)).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-4">
                <div className="bg-white/10 p-3 rounded-lg space-y-1">
                  <p className="text-[10px] uppercase font-bold opacity-70">Processing Fee</p>
                  <p className="text-xl font-bold">Rs. {Number(watch("processingFee")).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] opacity-70 leading-tight">
                  <Info className="w-3 h-3 flex-shrink-0" />
                  <p>All instalments will be recalculated and reset upon saving.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
