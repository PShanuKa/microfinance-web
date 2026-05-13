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
  MoreVertical, 
  Printer, 
  Search, 
  Upload, 
  User, 
  Users,
  CreditCard,
  Building,
  TrendingUp,
  Download,
  Trash2,
  XCircle,
  FileCheck
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
    const balance = loan.instalments.reduce((acc: number, inst: any) => acc + (Number(inst.dueAmount) - Number(inst.paidAmount)), 0);
    
    const totalInstalments = loan.instalments.length;
    const paidInstalments = loan.instalments.filter((inst: any) => inst.status === "PAID").length;

    return {
      principal,
      paid,
      balance,
      totalInstalments,
      paidInstalments,
      progress: principal > 0 ? (paid / principal) * 100 : 0
    };
  }, [loan]);

  // Group instalments by week for the schedule view
  const weeklySchedule = useMemo(() => {
    if (!loan?.instalments) return [];
    
    const weeks: any = {};
    loan.instalments.forEach((inst: any) => {
      if (!weeks[inst.weekNumber]) {
        weeks[inst.weekNumber] = {
          week: inst.weekNumber,
          date: inst.dueDate,
          dueAmount: 0,
          paidAmount: 0,
          status: "PAID",
        };
      }
      weeks[inst.weekNumber].dueAmount += Number(inst.dueAmount);
      weeks[inst.weekNumber].paidAmount += Number(inst.paidAmount);
      if (inst.status !== "PAID") {
        weeks[inst.weekNumber].status = "PENDING";
      }
    });

    return Object.values(weeks).sort((a: any, b: any) => a.week - b.week);
  }, [loan]);

  // Calculate member-wise status
  const memberStatus = useMemo(() => {
    if (!loan?.group?.members || !loan?.instalments) return [];

    return loan.group.members.map((m: any) => {
      const memberInstalments = loan.instalments.filter((inst: any) => inst.clientId === m.clientId);
      const amount = m.isLeader ? Number(loan.leaderLentAmount) : Number(loan.memberLentAmount);
      const paid = memberInstalments.reduce((acc: number, inst: any) => acc + Number(inst.paidAmount), 0);
      const isDelayed = memberInstalments.some((inst: any) => inst.status === "OVERDUE");

      return {
        id: m.client?.clientNo,
        name: m.client?.fullname,
        role: m.isLeader ? "Leader" : "Member",
        amount,
        paid,
        status: isDelayed ? "Delayed" : "On-Track"
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

  if (isLoading) return <div className="p-10 text-center">Loading loan details...</div>;
  if (!loan) return <div className="p-10 text-center">Loan not found.</div>;

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full font-bold text-white flex items-center gap-1 w-fit";
    switch (status) {
      case "APPROVED":
        return <Badge className={cn(baseStyle, "bg-emerald-500")}><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case "PENDING":
        return <Badge className={cn(baseStyle, "bg-amber-500")}><Clock className="h-3 w-3" />Pending Approval</Badge>;
      case "REJECTED":
        return <Badge className={cn(baseStyle, "bg-rose-500")}><XCircle className="h-3 w-3" />Rejected</Badge>;
      case "COMPLETED":
        return <Badge className={cn(baseStyle, "bg-blue-500")}><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className="text-muted-foreground px-3 py-1 rounded-full font-bold">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">{loan.id}</h1>
                {getStatusBadge(loan.status)}
             </div>
             <p className="text-sm text-muted-foreground font-medium">{loan.group?.name} • {loan.group?.branch} Branch</p>
          </div>
        </div>
        <div className="flex gap-2">
           {loan.status === "PENDING" && (
             <>
               <Button onClick={handleApprove} variant="default" className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" disabled={approveMutation.isPending}>
                 <FileCheck className="h-4 w-4" /> Approve
               </Button>
               <Button onClick={handleReject} variant="destructive" className="gap-2 shadow-lg shadow-rose-600/20" disabled={rejectMutation.isPending}>
                 <XCircle className="h-4 w-4" /> Reject
               </Button>
             </>
           )}
           <Button variant="outline" size="sm" className="gap-2 h-10 px-4">
             <Printer className="h-4 w-4" /> Print
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Principal</p>
              <p className="text-2xl font-black">Rs. {stats?.principal.toLocaleString()}</p>
              <p className="text-[10px] text-primary font-bold mt-2">Issued on {format(new Date(loan.createdAt), "yyyy-MM-dd")}</p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Paid</p>
              <p className="text-2xl font-black text-emerald-600">Rs. {stats?.paid.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-bold mt-2 flex items-center gap-1">
                <Badge variant="secondary" className="h-4 text-[9px] px-1 bg-emerald-500/10 text-emerald-600 border-none">
                  {stats?.paidInstalments} / {stats?.totalInstalments}
                </Badge>
                Instalments Paid
              </p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-rose-500">
              <Clock className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Outstanding</p>
              <p className="text-2xl font-black text-rose-500">Rs. {stats?.balance.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-bold mt-2">Week {weeklySchedule.filter(w => w.status === "PAID").length + 1} of {loan.totalWeeks} Active</p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <CardContent className="p-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Progress</p>
              <div className="flex items-end gap-2">
                 <p className="text-2xl font-black">{Math.round(stats?.progress || 0)}%</p>
                 <div className="flex-1 h-2 bg-muted rounded-full mb-2 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-primary shadow-lg shadow-primary/50 transition-all duration-1000" 
                      style={{ width: `${stats?.progress}%` }} 
                    />
                 </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-bold mt-1">Repayment Completion</p>
           </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card/40 backdrop-blur-md border h-14 p-1 gap-2 mb-6 w-full md:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="details" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all">
            <Info className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all">
            <Calendar className="h-4 w-4" />
            Repayment
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all">
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader className="border-b bg-muted/10">
                   <CardTitle className="text-lg font-bold">General Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted-foreground font-bold uppercase">Group Name</p>
                         <p className="text-sm font-bold flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary/60" />
                            {loan.group?.name}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted-foreground font-bold uppercase">Officer</p>
                         <p className="text-sm font-bold flex items-center gap-2">
                            <User className="h-4 w-4 text-primary/60" />
                            {loan.group?.officer?.fullname}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted-foreground font-bold uppercase">Branch</p>
                         <p className="text-sm font-bold flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary/60" />
                            {loan.group?.branch}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted-foreground font-bold uppercase">Processing Fee</p>
                         <p className="text-sm font-bold flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-primary/60" />
                            Rs. {Number(loan.processingFee).toLocaleString()}
                         </p>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader className="border-b bg-muted/10">
                   <CardTitle className="text-lg font-bold">Lending Terms</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-muted/50">
                      <div className="flex justify-between items-center p-4">
                         <span className="text-sm text-muted-foreground font-medium">Duration</span>
                         <span className="font-bold">{loan.totalWeeks} Weeks</span>
                      </div>
                      <div className="flex justify-between items-center p-4">
                         <span className="text-sm text-muted-foreground font-medium">Frequency</span>
                         <span className="font-bold uppercase text-primary text-xs">Weekly</span>
                      </div>
                      <div className="flex justify-between items-center p-4">
                         <span className="text-sm text-muted-foreground font-medium">Leader Weekly</span>
                         <span className="font-bold text-emerald-600">Rs. {Number(loan.leaderWeeklyAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-4">
                         <span className="text-sm text-muted-foreground font-medium">Member Weekly</span>
                         <span className="font-bold text-emerald-600">Rs. {Number(loan.memberWeeklyAmount).toLocaleString()}</span>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
             <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10">
                <div>
                   <CardTitle className="font-bold">Group Repayment Schedule</CardTitle>
                   <CardDescription>Consolidated weekly collection targets.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                   <Printer className="h-4 w-4" />
                   Print Schedule
                </Button>
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow className="bg-muted/20 border-none">
                           <TableHead className="font-bold text-foreground">Week</TableHead>
                           <TableHead className="font-bold text-foreground">Due Date</TableHead>
                           <TableHead className="font-bold text-foreground text-right">Target Amount</TableHead>
                           <TableHead className="font-bold text-foreground text-right">Collected</TableHead>
                           <TableHead className="font-bold text-center">Status</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {weeklySchedule.map((item: any) => (
                          <TableRow key={item.week} className="hover:bg-primary/5 transition-colors border-muted/50 group">
                             <TableCell className="font-bold py-4">Week {item.week}</TableCell>
                             <TableCell className="text-sm font-medium">{format(new Date(item.date), "PPP")}</TableCell>
                             <TableCell className="font-bold text-primary text-right">Rs. {item.dueAmount.toLocaleString()}</TableCell>
                             <TableCell className="font-bold text-emerald-600 text-right">Rs. {item.paidAmount.toLocaleString()}</TableCell>
                             <TableCell className="flex justify-center py-4">
                                <Badge variant={item.status === "PAID" ? "default" : "outline"} 
                                  className={cn(
                                    "font-bold px-3 py-1 rounded-full",
                                    item.status === "PAID" ? "bg-emerald-500 text-white border-none" : "border-amber-500/50 text-amber-600"
                                  )}
                                >
                                  {item.status === "PAID" ? "Collected" : "Pending"}
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

        <TabsContent value="members" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
             <CardHeader className="border-b bg-muted/10">
                <CardTitle className="font-bold">Individual Member Status</CardTitle>
                <CardDescription>Repayment tracking for each group member.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow className="bg-muted/20 border-none">
                           <TableHead className="font-bold text-foreground">Member</TableHead>
                           <TableHead className="font-bold text-foreground">Role</TableHead>
                           <TableHead className="font-bold text-foreground text-right">Total Principal</TableHead>
                           <TableHead className="font-bold text-foreground text-right">Total Paid</TableHead>
                           <TableHead className="font-bold text-foreground text-right">Balance</TableHead>
                           <TableHead className="font-bold text-center">Status</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {memberStatus.map((member: any) => (
                          <TableRow key={member.id} className="hover:bg-primary/5 transition-colors border-muted/50 group">
                             <TableCell className="py-4">
                                <div className="flex flex-col">
                                   <span className="font-bold group-hover:text-primary transition-colors">{member.name}</span>
                                   <span className="text-[10px] font-mono text-muted-foreground uppercase">{member.id}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <Badge variant="outline" className={cn(
                                  "text-[10px] font-black uppercase px-2 py-0.5 rounded-sm shadow-sm",
                                  member.role === "Leader" ? "border-amber-500/50 text-amber-600 bg-amber-500/5" : "border-primary/50 text-primary bg-primary/5"
                                )}>
                                  {member.role}
                                </Badge>
                             </TableCell>
                             <TableCell className="font-bold text-right py-4">Rs. {member.amount.toLocaleString()}</TableCell>
                             <TableCell className="font-bold text-emerald-600 text-right py-4">Rs. {member.paid.toLocaleString()}</TableCell>
                             <TableCell className="font-bold text-rose-500 text-right py-4">Rs. {(member.amount - member.paid).toLocaleString()}</TableCell>
                             <TableCell className="flex justify-center py-4">
                                <Badge className={cn(
                                  "font-bold px-3 py-1 rounded-full",
                                  member.status === "On-Track" ? "bg-emerald-500" : "bg-rose-500 shadow-lg shadow-rose-500/20"
                                )}>
                                  {member.status}
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
                <CardTitle className="font-bold">Activity Log</CardTitle>
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
                         <p className="text-xs text-muted-foreground">The loan application was submitted for group {loan.group?.name} and instalments were generated.</p>
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
                           <p className="text-xs text-muted-foreground">The loan was officially approved and marked as ready for disbursement.</p>
                           <p className="text-[10px] font-bold text-primary mt-1 flex items-center gap-1">
                              <User className="h-2.5 w-2.5" />
                              By {loan.approvedBy.fullname}
                           </p>
                        </div>
                     </div>
                   )}

                   {loan.rejectionReason && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-[34px] h-[34px] rounded-full bg-background border-2 border-rose-500 flex items-center justify-center z-10 shadow-lg shadow-rose-500/20">
                           <div className="w-2 h-2 rounded-full bg-rose-500" />
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-foreground">Loan Rejected</h4>
                              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{format(new Date(loan.updatedAt), "PPP p")}</span>
                           </div>
                           <p className="text-xs text-rose-500 font-medium">Reason: {loan.rejectionReason}</p>
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
