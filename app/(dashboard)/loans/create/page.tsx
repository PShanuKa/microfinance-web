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
  LayoutList,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LoanGuarantorsModal } from "@/components/Custom/LoanGuarantorsModal";

export default function CreateLoanPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  
  // Guarantor State
  const [memberGuarantors, setMemberGuarantors] = useState<Record<string, any[]>>({});
  const [isGuarantorModalOpen, setIsGuarantorModalOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<any>(null);

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
    
    // Check if all members have guarantors
    if (!isDraft && selectedGroup) {
      const missingGuarantors = selectedGroup.members.some((m: any) => {
        const gs = memberGuarantors[m.clientId];
        return !gs || gs.length < 2 || gs.some(g => !g.fullname || !g.nic || !g.phone || !g.address);
      });

      if (missingGuarantors) {
        setServerError("Please complete guarantor details for all group members before submitting.");
        return;
      }
    }

    // Prepare guarantor payload
    const guarantorPayload = Object.entries(memberGuarantors).map(([clientId, guarantors]) => ({
      clientId,
      guarantors
    }));

    createMutation.mutate({
      ...data,
      totalWeeks: Number(data.totalWeeks),
      processingFee: Number(data.processingFee),
      leaderLentAmount: Number(data.leaderLentAmount),
      leaderWeeklyAmount: Number(data.leaderWeeklyAmount),
      memberLentAmount: Number(data.memberLentAmount),
      memberWeeklyAmount: Number(data.memberWeeklyAmount),
      memberGuarantors: guarantorPayload,
      status: isDraft ? "DRAFT" : "PENDING",
      createdBy: "system",
    });
  };

  const openGuarantorManager = (member: any) => {
    setActiveMember(member);
    setIsGuarantorModalOpen(true);
  };

  const handleSaveGuarantors = (guarantors: any[]) => {
    if (activeMember) {
      setMemberGuarantors(prev => ({
        ...prev,
        [activeMember.clientId]: guarantors
      }));
    }
  };

  const isMemberGuarantorComplete = (clientId: string) => {
    const gs = memberGuarantors[clientId];
    return gs && gs.length === 2 && gs.every(g => g.fullname && g.nic && g.phone && g.address);
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
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-black p-4 rounded-xl text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5" /> {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
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
                  <SelectTrigger className="bg-background/50 h-12 text-lg font-bold">
                    <SelectValue placeholder="Choose a group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groupsData?.groups?.map((group: any) => (
                      <SelectItem key={group.id} value={group.id} className="font-semibold">
                        {group.name} ({group.branch})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedGroup && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-3 group hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-4 h-4" /> Group Leader
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 leading-tight">{groupLeader?.client?.fullname || "No Leader Assigned"}</span>
                        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {groupLeader?.client?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3 group hover:bg-amber-500/10 transition-colors">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4" /> Collection Details
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <CalendarDays className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-amber-700 leading-tight">
                          Every {DAYS[selectedGroup.collectionDay - 1]}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">{selectedGroup.branch} Branch | {totalMembers} Members</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-muted/10 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <CalendarDays className="w-5 h-5 text-primary" /> Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="totalWeeks" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Duration (Weeks)</Label>
                <Input
                  id="totalWeeks"
                  type="number"
                  className="bg-background/50 h-12 text-lg font-black"
                  {...register("totalWeeks", { required: true, min: 1 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="processingFee" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Processing Fee (Rs.)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  className="bg-background/50 h-12 text-lg font-black"
                  {...register("processingFee", { required: true, min: 0 })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-600">
                <Crown className="w-5 h-5" /> Leader Plan Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="leaderLentAmount" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Lent Amount (Rs.)</Label>
                  <Input
                    id="leaderLentAmount"
                    type="number"
                    className="bg-background/50 h-11 font-black"
                    {...register("leaderLentAmount", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leaderWeeklyAmount" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Weekly Payment (Rs.)</Label>
                  <Input
                    id="leaderWeeklyAmount"
                    type="number"
                    className="bg-background/50 h-11 font-black"
                    {...register("leaderWeeklyAmount", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" /> Member Plan Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="memberLentAmount" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Lent Amount (Rs.)</Label>
                  <Input
                    id="memberLentAmount"
                    type="number"
                    className="bg-background/50 h-11 font-black"
                    {...register("memberLentAmount", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memberWeeklyAmount" className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Weekly Payment (Rs.)</Label>
                  <Input
                    id="memberWeeklyAmount"
                    type="number"
                    className="bg-background/50 h-11 font-black"
                    {...register("memberWeeklyAmount", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member-wise Table with Guarantors */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <LayoutList className="w-5 h-5 text-primary" /> Member Restructuring & Guarantors
              </CardTitle>
              <CardDescription>Assign guarantors and review member-wise loan details</CardDescription>
            </div>
            {selectedGroup && (
              <Badge variant="outline" className="font-black bg-background/50 px-4 py-1.5 rounded-full border-primary/20 text-primary uppercase text-[10px] tracking-widest">
                {totalMembers} Profiles Active
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                    <TableHead className="font-bold text-foreground">Member</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Lent (Rs.)</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Weekly (Rs.)</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Total (Rs.)</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Guarantors</TableHead>
                    <TableHead className="text-right font-bold text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedGroup ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic font-semibold">
                        Select a group to manage member details and guarantors
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedGroup?.members?.map((member: any) => {
                      const principal = member.isLeader ? leaderLent : memberLent;
                      const weekly = member.isLeader ? leaderWeekly : memberWeekly;
                      const loanAmount = weekly * totalWeeks;
                      const isComplete = isMemberGuarantorComplete(member.clientId);

                      return (
                        <TableRow key={member.clientId} className="hover:bg-primary/5 transition-colors group">
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 flex items-center gap-1.5">
                                {member.client.fullname}
                                {member.isLeader && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{member.client.clientNo}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-600">Rs. {principal.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold text-slate-600">Rs. {weekly.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-primary">Rs. {loanAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "font-black text-[9px] uppercase tracking-wider py-1 px-3 rounded-full border-none",
                              isComplete ? "bg-emerald-500 text-white" : "bg-rose-500/10 text-rose-600 animate-pulse"
                            )}>
                              {isComplete ? (
                                <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Complete</div>
                              ) : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              type="button" 
                              variant={isComplete ? "outline" : "default"} 
                              size="sm" 
                              className={cn("gap-2 font-bold", !isComplete && "shadow-lg shadow-primary/20")}
                              onClick={() => openGuarantorManager(member)}
                            >
                              <ShieldCheck className="w-4 h-4" /> 
                              {isComplete ? "Edit Guarantors" : "Add Guarantors"}
                            </Button>
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

        {/* Global Stats Projection */}
        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-[100px] opacity-50"></div>
          <CardHeader className="border-b border-white/10 relative z-10">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" /> GLOBAL FINANCIAL PROJECTION
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    Total Principal
                 </span>
                 <span className="text-3xl font-black text-white">
                    Rs. {totalLentAmount.toLocaleString()}
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    Expected Receipts
                 </span>
                 <span className="text-3xl font-black text-emerald-400">
                    Rs. {totalScheduledReceipts.toLocaleString()}
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1">
                 <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest flex items-center gap-1.5">
                    Projected Margin
                 </span>
                 <span className="text-3xl font-black text-primary">
                    Rs. {(totalScheduledReceipts - totalLentAmount).toLocaleString()}
                 </span>
              </div>
              <div className="p-6 flex flex-col gap-1 bg-primary/5">
                 <span className="text-[10px] uppercase font-black text-white tracking-widest flex items-center gap-1.5">
                    Processing Income
                 </span>
                 <span className="text-3xl font-black text-amber-400">
                    Rs. {(Number(watch("processingFee") || 0) * totalMembers).toLocaleString()}
                 </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <Button 
            type="submit" 
            variant="outline"
            size="lg" 
            disabled={createMutation.isPending || !selectedGroupId}
            onClick={() => setIsDraft(true)}
            className="gap-2 px-8 h-14 font-black text-slate-700 border-2"
          >
            {createMutation.isPending && isDraft ? "Saving..." : (
              <>
                <FileText className="h-5 w-5" /> Save as Draft
              </>
            )}
          </Button>
          <Button 
            type="submit" 
            size="lg" 
            disabled={createMutation.isPending || !selectedGroupId}
            onClick={() => setIsDraft(false)}
            className="gap-2 px-12 h-14 font-black shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-lg"
          >
            {createMutation.isPending && !isDraft ? "Submitting..." : (
              <>
                <SendHorizontal className="h-5 w-5" /> SUBMIT FOR APPROVAL
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Guarantor Modal */}
      <LoanGuarantorsModal
        open={isGuarantorModalOpen}
        onOpenChange={setIsGuarantorModalOpen}
        member={activeMember}
        initialGuarantors={activeMember ? memberGuarantors[activeMember.clientId] || [] : []}
        onSave={handleSaveGuarantors}
      />
    </div>
  );
}
