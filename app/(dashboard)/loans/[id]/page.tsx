"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  History as HistoryIcon, 
  Info, 
  Printer, 
  User, 
  Users,
  CreditCard,
  Building,
  TrendingUp,
  XCircle,
  FileCheck,
  Wallet,
  ArrowUpRight,
  Receipt,
  LayoutList,
  Crown,
  Phone,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLoanQuery, useApproveLoanMutation, useRejectLoanMutation } from "@/services/loanApi";
import { format } from "date-fns";

export default function LoanViewPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = useLoanQuery(id as string);
  const approveMutation = useApproveLoanMutation();
  const rejectMutation = useRejectLoanMutation();

  const loan = data?.loan;

  const stats = useMemo(() => {
    if (!loan) return null;

    const totalMembers = loan.group?.members?.length || 0;
    const leaderLent = Number(loan.leaderLentAmount);
    const memberLent = Number(loan.memberLentAmount);
    
    const principal = leaderLent + (memberLent * (totalMembers - 1));
    const paid = loan.instalments.reduce((acc: number, inst: any) => acc + Number(inst.paidAmount), 0);
    const totalScheduled = loan.instalments.reduce((acc: number, inst: any) => acc + Number(inst.dueAmount), 0);
    const balance = totalScheduled - paid;
    const outstanding = loan.instalments.reduce((acc: number, inst: any) => {
        // If dueDate is in past and status is not PAID
        const isPast = new Date(inst.dueDate) < new Date();
        return isPast && inst.status !== "PAID" ? acc + Number(inst.remainingDue) : acc;
    }, 0);
    
    const totalInstalments = loan.instalments.length;
    const paidInstalmentsCount = loan.instalments.filter((inst: any) => inst.status === "PAID").length;

    return {
      principal,
      paid,
      balance,
      outstanding,
      totalInstalments,
      paidInstalmentsCount,
      totalScheduled,
      progress: totalScheduled > 0 ? (paid / totalScheduled) * 100 : 0
    };
  }, [loan]);

  // Grouped Member Data for "Structure Preview"
  const memberSummaries = useMemo(() => {
    if (!loan?.group?.members || !loan?.instalments) return [];

    return loan.group.members.map((m: any) => {
      const memberInstalments = loan.instalments.filter((inst: any) => inst.clientId === m.clientId);
      const principal = m.isLeader ? Number(loan.leaderLentAmount) : Number(loan.memberLentAmount);
      const loanAmount = memberInstalments.reduce((acc: number, inst: any) => acc + Number(inst.dueAmount), 0);
      const paid = memberInstalments.reduce((acc: number, inst: any) => acc + Number(inst.paidAmount), 0);
      const balance = loanAmount - paid;
      const outstanding = memberInstalments.reduce((acc: number, inst: any) => {
          const isPast = new Date(inst.dueDate) < new Date();
          return isPast && inst.status !== "PAID" ? acc + Number(inst.remainingDue) : acc;
      }, 0);
      const arrearsCount = memberInstalments.filter((inst: any) => {
          const isPast = new Date(inst.dueDate) < new Date();
          return isPast && inst.status !== "PAID";
      }).length;

      return {
        ...m,
        principal,
        loanAmount,
        interest: loanAmount - principal,
        paid,
        balance,
        outstanding,
        arrearsCount
      };
    });
  }, [loan]);

  const handleApprove = () => {
    if (confirm("Approve this loan application?")) {
      approveMutation.mutate({ id: id as string, approvedById: "system" });
    }
  };

  const handleReject = () => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      rejectMutation.mutate({ id: id as string, rejectionReason: reason });
    }
  };

  if (isLoading) return <div className="p-10 text-center font-medium animate-pulse">Loading loan details...</div>;
  if (!loan) return <div className="p-10 text-center font-medium">Loan not found.</div>;

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-2 transition-all";
    switch (status) {
      case "APPROVED":
        return <Badge className={cn(baseStyle, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/10")}><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case "PENDING":
        return <Badge className={cn(baseStyle, "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm shadow-amber-500/10")}><Clock className="h-3 w-3" />Pending</Badge>;
      case "REJECTED":
        return <Badge className={cn(baseStyle, "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-sm shadow-rose-500/10")}><XCircle className="h-3 w-3" />Rejected</Badge>;
      case "COMPLETED":
        return <Badge className={cn(baseStyle, "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm shadow-blue-500/10")}><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className={cn(baseStyle, "bg-slate-100 text-slate-500 border-slate-200")}>Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black tracking-tighter text-slate-900">{loan.loanNo}</h1>
                {getStatusBadge(loan.status)}
             </div>
             <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" /> {loan.group?.name} <span className="opacity-40">|</span> <Building className="w-4 h-4" /> {loan.group?.branch} Branch
             </p>
          </div>
        </div>
        <div className="flex gap-2">
           {loan.status === "PENDING" && (
             <>
               <Button onClick={handleApprove} variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 h-11 px-6 font-bold" disabled={approveMutation.isPending}>
                 <FileCheck className="h-4 w-4" /> Approve Loan
               </Button>
               <Button onClick={handleReject} variant="destructive" className="gap-2 shadow-lg shadow-rose-600/20 h-11 px-6 font-bold" disabled={rejectMutation.isPending}>
                 <XCircle className="h-4 w-4" /> Reject
               </Button>
             </>
           )}
           <Button variant="outline" className="gap-2 h-11 px-6 font-bold">
             <Printer className="h-4 w-4" /> Print
           </Button>
        </div>
      </div>

      {/* Info Section (Leader & Collection) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <Crown className="w-4 h-4" /> Group Leader
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight">{loan.group?.members?.find((m: any) => m.isLeader)?.client?.fullname || "No Leader"}</span>
                        <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {loan.group?.members?.find((m: any) => m.isLeader)?.client?.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                      <Calendar className="w-4 h-4" /> Collection Cycle
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <CalendarDays className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight text-amber-700">
                          Every {DAYS[loan.group?.collectionDay - 1]}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">Automatic Weekly Cycle</span>
                      </div>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Info className="w-24 h-24" />
             </div>
             <CardContent className="p-6 grid grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Processing Fee</p>
                   <p className="text-xl font-black text-slate-800">Rs. {Number(loan.processingFee).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Loan Duration</p>
                   <p className="text-xl font-black text-slate-800">{loan.totalWeeks} Weeks</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Weekly Leader</p>
                   <p className="text-sm font-bold text-emerald-600">Rs. {Number(loan.leaderWeeklyAmount).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Weekly Member</p>
                   <p className="text-sm font-bold text-emerald-600">Rs. {Number(loan.memberWeeklyAmount).toLocaleString()}</p>
                </div>
             </CardContent>
          </Card>
      </div>

      {/* Live Financial Projections */}
      <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-foreground" /> Loan Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Total Principal
               </span>
               <span className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                  Rs. {stats?.principal.toLocaleString()}
               </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Paid Amount
               </span>
               <span className="text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left">
                  Rs. {stats?.paid.toLocaleString()}
               </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-primary-foreground" /> Balance Amount
               </span>
               <span className="text-2xl font-black text-primary-foreground group-hover:scale-105 transition-transform origin-left">
                  Rs. {stats?.balance.toLocaleString()}
               </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
               <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                  <Receipt className="w-3 h-3 text-amber-400" /> Total Outstanding
               </span>
               <span className="text-2xl font-black text-amber-400 group-hover:scale-105 transition-transform origin-left">
                  Rs. {stats?.outstanding.toLocaleString()}
               </span>
            </div>
          </div>
          {/* Progress Bar Footer */}
          <div className="h-1 bg-white/5 w-full">
            <div 
                className="h-full bg-primary shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                style={{ width: `${stats?.progress}%` }} 
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="bg-card/40 backdrop-blur-md border h-14 p-1 gap-2 mb-6 justify-start w-full md:w-auto">
          <TabsTrigger value="structure" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full">
            <LayoutList className="h-4 w-4" />
            Loan Structure
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full">
            <Calendar className="h-4 w-4" />
            Repayment Schedule
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full">
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Member-wise Structure Table */}
           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-primary/20">
              <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <Users className="w-5 h-5 text-primary" /> Member Performance Summary
                  </CardTitle>
                  <CardDescription className="font-medium">Current status and financial metrics for each group member</CardDescription>
                </div>
                <Badge variant="outline" className="font-black bg-background/50 px-3 py-1">
                    {loan.group?._count?.members || 0} Linked Profiles
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                        <TableHead className="font-bold text-foreground">Client ID</TableHead>
                        <TableHead className="font-bold text-foreground">Name</TableHead>
                        <TableHead className="font-bold text-foreground text-right">Principal</TableHead>
                        <TableHead className="font-bold text-foreground text-right">Paid</TableHead>
                        <TableHead className="font-bold text-foreground text-right">Balance</TableHead>
                        <TableHead className="font-bold text-foreground text-right">Outstanding</TableHead>
                        <TableHead className="font-bold text-foreground text-center">Arrears</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberSummaries.map((member: any) => (
                        <TableRow key={member.clientId} className="hover:bg-primary/5 transition-colors group border-b last:border-0">
                          <TableCell className="font-mono text-xs font-bold text-slate-500">{member.client?.clientNo}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-black flex items-center gap-1.5 text-slate-800 group-hover:text-primary transition-colors">
                                {member.client?.fullname}
                                {member.isLeader && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-600">Rs. {member.principal.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-emerald-600">Rs. {member.paid.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-primary">Rs. {member.balance.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-rose-600 bg-rose-500/5">Rs. {member.outstanding.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                                "font-black px-2.5 py-0.5 rounded-full border-none",
                                member.arrearsCount > 0 ? "bg-rose-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                            )}>
                                {member.arrearsCount}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="schedule" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-amber-500/20">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10">
                <div>
                  <CardTitle className="font-bold text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-600" /> Full Repayment Schedule
                  </CardTitle>
                  <CardDescription className="font-medium">Every individual instalment for all group members across {loan.totalWeeks} weeks.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2 border-amber-500/20 text-amber-700 hover:bg-amber-500/5 h-10 px-4 font-bold">
                  <Printer className="h-4 w-4" /> Export Schedule
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <Table className="relative">
                    <TableHeader className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                      <TableRow className="border-b">
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4 px-6 w-16">Week</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4">Client</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4">Due Date</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4 text-right">Target</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4 text-right">Collected</TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-500 py-4 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loan.instalments.map((inst: any, idx: number) => (
                        <TableRow key={inst.id} className={cn(
                            "hover:bg-amber-500/5 transition-colors border-b last:border-0",
                            inst.status === "PAID" ? "bg-emerald-500/[0.02]" : ""
                        )}>
                          <TableCell className="py-4 px-6 font-black text-slate-400">#{inst.weekNumber}</TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{inst.client?.fullname}</span>
                                <span className="text-[10px] font-mono text-muted-foreground">{inst.client?.clientNo}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-slate-600">{format(new Date(inst.dueDate), "PPP")}</TableCell>
                          <TableCell className="text-right font-black text-primary">Rs. {Number(inst.dueAmount).toLocaleString()}</TableCell>
                          <TableCell className="text-right font-black text-emerald-600">Rs. {Number(inst.paidAmount).toLocaleString()}</TableCell>
                          <TableCell className="flex justify-center py-4">
                            <Badge className={cn(
                                "font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter border-none",
                                inst.status === "PAID" ? "bg-emerald-500 text-white" : 
                                inst.status === "PARTIAL" ? "bg-amber-500 text-white" : 
                                inst.status === "OVERDUE" ? "bg-rose-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                            )}>
                              {inst.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader className="border-b bg-muted/10">
                 <CardTitle className="font-bold">Transaction & Activity History</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-muted">
                    <div className="relative pl-10">
                       <div className="absolute left-0 top-1 w-[34px] h-[34px] rounded-full bg-background border-2 border-emerald-500 flex items-center justify-center z-10 shadow-lg shadow-emerald-500/20">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       </div>
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                             <h4 className="text-sm font-bold text-foreground">Loan Application Created</h4>
                             <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{format(new Date(loan.createdAt), "PPP p")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">The loan application was submitted with identification {loan.loanNo} for group {loan.group?.name}.</p>
                          <p className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1">
                             <User className="h-2.5 w-2.5" />
                             By {loan.createdBy}
                          </p>
                       </div>
                    </div>

                    {loan.approvedBy && (
                       <div className="relative pl-10">
                         <div className="absolute left-0 top-1 w-[34px] h-[34px] rounded-full bg-background border-2 border-blue-500 flex items-center justify-center z-10 shadow-lg shadow-blue-500/20">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                               <h4 className="text-sm font-bold text-foreground">Loan Approved</h4>
                               <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{format(new Date(loan.updatedAt), "PPP p")}</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">The application was reviewed and officially approved for disbursement.</p>
                            <p className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1">
                               <User className="h-2.5 w-2.5" />
                               By {loan.approvedBy.fullname}
                            </p>
                         </div>
                      </div>
                    )}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
