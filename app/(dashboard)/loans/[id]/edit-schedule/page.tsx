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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/Custom/PageHeader";
import { useLoanQuery, useUpdateLoanScheduleMutation } from "@/services/loanApi";
import { useGroupsQuery } from "@/services/groupApi";
import { 
  Save, 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  CircleDollarSign,
  Crown,
  FileText,
  User,
  Phone,
  Calendar,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  LayoutList,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LoanGuarantorsModal } from "@/components/Custom/LoanGuarantorsModal";

export default function EditLoanSchedulePage() {
  const router = useRouter();
  const { id } = useParams();
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Guarantor State
  const [memberGuarantors, setMemberGuarantors] = useState<Record<string, any[]>>({});
  const [isGuarantorModalOpen, setIsGuarantorModalOpen] = useState(false);
  const [activeMember, setActiveMember] = useState<any>(null);

  const { data: groupsData } = useGroupsQuery({ limit: 100 });
  const { data: loanData, isLoading: loanLoading } = useLoanQuery(id as string);
  const updateMutation = useUpdateLoanScheduleMutation({
    onSuccess: () => {
      router.push(`/loans/${id}`);
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

      // Load existing guarantors
      const existingGuarantors: Record<string, any[]> = {};
      loanData.loan.guarantors.forEach((g: any) => {
        if (!existingGuarantors[g.clientId]) {
          existingGuarantors[g.clientId] = [];
        }
        existingGuarantors[g.clientId].push(g);
      });
      setMemberGuarantors(existingGuarantors);
    }
  }, [loanData, reset]);

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

    // Prepare guarantor payload
    const guarantorPayload = Object.entries(memberGuarantors).map(([clientId, guarantors]) => ({
      clientId,
      guarantors: guarantors.map(({ id, ...rest }) => rest) // Remove IDs for clean creation
    }));

    updateMutation.mutate({
      id: id as string,
      data: {
        ...data,
        totalWeeks: Number(data.totalWeeks),
        processingFee: Number(data.processingFee),
        leaderLentAmount: Number(data.leaderLentAmount),
        leaderWeeklyAmount: Number(data.leaderWeeklyAmount),
        memberLentAmount: Number(data.memberLentAmount),
        memberWeeklyAmount: Number(data.memberWeeklyAmount),
        memberGuarantors: guarantorPayload,
      }
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

  if (loanLoading) return <div className="p-10 text-center font-bold animate-pulse">Loading loan details...</div>;

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <PageHeader
        title={`Edit Loan Schedule: ${loanData?.loan?.loanNo}`}
        description="Modify loan parameters and update the repayment structure"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2 border-primary/20 hover:bg-primary/5">
          <ArrowLeft className="h-4 w-4" /> Back to Details
        </Button>
      </PageHeader>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-4 text-amber-700 animate-in fade-in slide-in-from-top-2">
        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-bold uppercase tracking-tight">Warning: Schedule Regeneration</p>
          <p className="opacity-90 font-medium leading-tight">Updating these parameters will completely delete and recreate all future instalments and guarantor data for this loan. This action cannot be undone.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
            {serverError}
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
                <Label>Change Group</Label>
                <Select
                  value={selectedGroupId}
                  onValueChange={(val) => setValue("groupId", val)}
                >
                  <SelectTrigger className="bg-background/50 h-12 text-lg font-bold">
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
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-base leading-tight">{groupLeader?.client?.fullname || "No Leader Assigned"}</span>
                        <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {groupLeader?.client?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4" /> Collection Cycle
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <CalendarDays className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-base leading-tight text-amber-700">
                          Every {DAYS[selectedGroup.collectionDay - 1]}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Automatic Weekly Cycle</span>
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
                <Label htmlFor="totalWeeks" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Duration (Weeks)</Label>
                <Input
                  id="totalWeeks"
                  type="number"
                  className="bg-background/50 h-11 font-black text-lg"
                  {...register("totalWeeks", { required: true, min: 1 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="processingFee" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Processing Fee (Rs.)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  className="bg-background/50 h-11 font-black text-lg"
                  {...register("processingFee", { required: true, min: 0 })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-amber-500/5 border-b border-amber-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-600">
                <Crown className="w-5 h-5" /> Leader Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="leaderLentAmount" className="font-bold text-[10px] uppercase text-muted-foreground">Lent Amount</Label>
                  <Input
                    id="leaderLentAmount"
                    type="number"
                    className="bg-background/50 h-11 font-bold"
                    {...register("leaderLentAmount", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leaderWeeklyAmount" className="font-bold text-[10px] uppercase text-muted-foreground">Weekly Payment</Label>
                  <Input
                    id="leaderWeeklyAmount"
                    type="number"
                    className="bg-background/50 h-11 font-bold text-emerald-600"
                    {...register("leaderWeeklyAmount", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" /> Member Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="memberLentAmount" className="font-bold text-[10px] uppercase text-muted-foreground">Lent Amount</Label>
                  <Input
                    id="memberLentAmount"
                    type="number"
                    className="bg-background/50 h-11 font-bold"
                    {...register("memberLentAmount", { required: true })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memberWeeklyAmount" className="font-bold text-[10px] uppercase text-muted-foreground">Weekly Payment</Label>
                  <Input
                    id="memberWeeklyAmount"
                    type="number"
                    className="bg-background/50 h-11 font-bold text-emerald-600"
                    {...register("memberWeeklyAmount", { required: true })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member-wise Preview & Guarantors */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <LayoutList className="w-5 h-5 text-primary" /> Structure & Guarantors Review
              </CardTitle>
              <CardDescription className="font-medium">Update member-wise details and guarantors</CardDescription>
            </div>
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
                  {selectedGroup?.members?.map((member: any) => {
                    const principal = member.isLeader ? leaderLent : memberLent;
                    const weekly = member.isLeader ? leaderWeekly : memberWeekly;
                    const loanAmount = weekly * totalWeeks;
                    const isComplete = isMemberGuarantorComplete(member.clientId);

                    return (
                      <TableRow key={member.clientId} className="hover:bg-primary/5 transition-colors group border-b last:border-0">
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
                          <span className={cn(
                            "font-black text-xs px-3 py-1 rounded-full",
                            (memberGuarantors[member.clientId]?.length || 0) > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                          )}>
                            {memberGuarantors[member.clientId]?.length || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            type="button" 
                            variant={(memberGuarantors[member.clientId]?.length || 0) > 0 ? "ghost" : "outline"} 
                            size="sm" 
                            className="gap-2 font-bold text-primary hover:bg-primary/5"
                            onClick={() => openGuarantorManager(member)}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            {(memberGuarantors[member.clientId]?.length || 0) > 0 ? "Manage" : "Add Guarantors"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Global Financial Projections */}
        <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <CardHeader className="border-b border-white/10 bg-white/5">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-foreground" /> Global Projection Update
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
                    <TrendingUp className="w-3 h-3 text-emerald-400" /> Projected Receipts
               </span>
               <span className="text-2xl font-black text-emerald-400">
                    Rs. {totalScheduledReceipts.toLocaleString()}
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button 
            type="submit" 
            size="lg" 
            disabled={updateMutation.isPending || !selectedGroupId}
            className="gap-2 px-10 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-12 font-black"
          >
            {updateMutation.isPending ? "Restructuring..." : (
              <>
                <Save className="h-4 w-4" /> Save & Update All Schedules
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
