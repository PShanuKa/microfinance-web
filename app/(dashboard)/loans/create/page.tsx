"use client";

import React, { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/Custom/PageHeader";
import { useCreateLoanMutation } from "@/services/loanApi";
import { useGroupsQuery } from "@/services/groupApi";
import { 
  Save, 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  CircleDollarSign,
  Crown,
  FileText,
  SendHorizontal,
  User,
  Phone,
  Calendar,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  LayoutList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CreateLoanPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);

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
  const groupLeader = selectedGroup?.members?.find((m: any) => m.isLeader);

  const totalWeeks = Number(watch("totalWeeks") || 0);
  const leaderLent = Number(watch("leaderLentAmount") || 0);
  const memberLent = Number(watch("memberLentAmount") || 0);
  const leaderWeekly = Number(watch("leaderWeeklyAmount") || 0);
  const memberWeekly = Number(watch("memberWeeklyAmount") || 0);
  const totalMembers = selectedGroup?._count?.members || 0;

  // Global Calculations
  const totalLentAmount = selectedGroup 
    ? leaderLent + (memberLent * (totalMembers - 1)) 
    : 0;

  const totalScheduledReceipts = selectedGroup
    ? (leaderWeekly * totalWeeks) + (memberWeekly * totalWeeks * (totalMembers - 1))
    : 0;

  const onFormSubmit = (data: any) => {
    setServerError(null);
    createMutation.mutate({
      ...data,
      totalWeeks: Number(data.totalWeeks),
      processingFee: Number(data.processingFee),
      leaderLentAmount: Number(data.leaderLentAmount),
      leaderWeeklyAmount: Number(data.leaderWeeklyAmount),
      memberLentAmount: Number(data.memberLentAmount),
      memberWeeklyAmount: Number(data.memberWeeklyAmount),
      status: isDraft ? "DRAFT" : "PENDING",
      createdBy: "system",
    });
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <PageHeader
        title="Create New Loan"
        description="Fill in the group loan details and submit for approval or save as draft"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Group Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-2">
                <Label>Select Group</Label>
                <Select
                  value={selectedGroupId}
                  onValueChange={(val) => setValue("groupId", val)}
                >
                  <SelectTrigger className="bg-background/50 h-12 text-lg">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-4 h-4" /> Group Leader
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base leading-tight">{groupLeader?.client?.fullname || "No Leader Assigned"}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {groupLeader?.client?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4" /> Collection Details
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <CalendarDays className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base leading-tight text-amber-700">
                          Every {DAYS[selectedGroup.collectionDay - 1]}
                        </span>
                        <span className="text-xs text-muted-foreground">{selectedGroup.branch} Branch | {totalMembers} Members</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" /> Leader Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Member Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Financial Projections */}
        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-foreground" /> Loan Projection Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Total Principal
                 </span>
                 <span className="text-2xl font-black text-white">
                    Rs. {totalLentAmount.toLocaleString()}
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                    <trending-up className="w-3 h-3 text-emerald-400" /> Paid Amount
                 </span>
                 <span className="text-2xl font-black text-emerald-400">
                    Rs. 0
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary-foreground" /> Balance Amount
                 </span>
                 <span className="text-2xl font-black text-primary-foreground">
                    Rs. {totalScheduledReceipts.toLocaleString()}
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                    <Receipt className="w-3 h-3 text-amber-400" /> Total Outstanding
                 </span>
                 <span className="text-2xl font-black text-amber-400">
                    Rs. {totalLentAmount.toLocaleString()}
                 </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member-wise Instalment Preview Table */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-primary" /> Loan Structure Preview
              </CardTitle>
              <CardDescription>Member-wise breakdown of the proposed loan structure</CardDescription>
            </div>
            {selectedGroup && (
              <Badge variant="outline" className="font-bold bg-background/50">
                {totalMembers} Profiles Linked
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                    <TableHead className="font-bold text-foreground">Client ID</TableHead>
                    <TableHead className="font-bold text-foreground">Name</TableHead>
                    <TableHead className="font-bold text-foreground">Loan Number</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Principal</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Interest</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Loan Amount</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Balance</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Outstanding</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Arrears Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedGroup ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                        Select a group to preview member instalments
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedGroup?.members?.map((member: any) => {
                      const principal = member.isLeader ? leaderLent : memberLent;
                      const weekly = member.isLeader ? leaderWeekly : memberWeekly;
                      const loanAmount = weekly * totalWeeks;
                      const interest = loanAmount - principal;

                      return (
                        <TableRow key={member.clientId} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="font-mono text-xs">{member.client.clientNo}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold flex items-center gap-1">
                                {member.client.fullname}
                                {member.isLeader && <Crown className="w-3 h-3 text-amber-500" />}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium text-xs">L-XXXXXX</TableCell>
                          <TableCell className="text-right font-bold">Rs. {principal.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-muted-foreground italic">Rs. {interest.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-primary">Rs. {loanAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold text-emerald-600">Rs. {loanAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold text-slate-400">Rs. 0</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="font-black opacity-30">0</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button 
            type="submit" 
            variant="secondary"
            size="lg" 
            disabled={createMutation.isPending || !selectedGroupId}
            onClick={() => setIsDraft(true)}
            className="gap-2 px-8 shadow-md h-12"
          >
            {createMutation.isPending && isDraft ? "Saving..." : (
              <>
                <FileText className="h-4 w-4" /> Save as Draft
              </>
            )}
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={createMutation.isPending || !selectedGroupId}
            onClick={() => setIsDraft(false)}
            className="gap-2 px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-12"
          >
            {createMutation.isPending && !isDraft ? "Submitting..." : (
              <>
                <SendHorizontal className="h-4 w-4" /> Submit for Approval
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
