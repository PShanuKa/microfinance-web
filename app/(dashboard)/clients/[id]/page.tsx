"use client";

import React, { useMemo } from "react";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  History as HistoryIcon,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Receipt,
  LayoutList,
  Wallet
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
import { useClientQuery } from "@/services/clientApi";
import { format } from "date-fns";

export default function ClientProfilePage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = useClientQuery(id as string);
  const client = data?.client;

  const stats = useMemo(() => {
    if (!client) return null;

    const totalLoans = [...new Set(client.instalments.map((i: any) => i.loanId))].length;
    const activeLoans = [...new Set(client.instalments.filter((i: any) => i.loan.status === "APPROVED" || i.loan.status === "ACTIVE").map((i: any) => i.loanId))].length;
    
    const totalPaid = client.instalments.reduce((acc: number, inst: any) => acc + Number(inst.paidAmount), 0);
    const totalDue = client.instalments.reduce((acc: number, inst: any) => acc + Number(inst.dueAmount), 0);
    const balance = totalDue - totalPaid;
    
    const totalGroups = client.groupMembers?.length || 0;

    return {
      totalLoans,
      activeLoans,
      totalPaid,
      balance,
      totalGroups,
      totalDue
    };
  }, [client]);

  if (isLoading) return <div className="p-10 text-center font-medium animate-pulse">Loading profile...</div>;
  if (!client) return <div className="p-10 text-center font-medium">Client not found.</div>;

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-2 transition-all";
    switch (status) {
      case "ACTIVE":
        return <Badge className={cn(baseStyle, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/10")}><CheckCircle2 className="h-3 w-3" />Active</Badge>;
      case "BLACKLISTED":
        return <Badge className={cn(baseStyle, "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-sm shadow-rose-500/10")}><AlertCircle className="h-3 w-3" />Blacklisted</Badge>;
      case "INACTIVE":
        return <Badge className={cn(baseStyle, "bg-slate-100 text-slate-500 border-slate-200")}>Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-5">
             {/* Profile Image Display */}
             <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-muted flex items-center justify-center ring-1 ring-slate-200">
                   {client.profileImage?.fileUrl ? (
                      <img 
                        src={client.profileImage.fileUrl} 
                        alt={client.fullname} 
                        className="w-full h-full object-cover"
                      />
                   ) : (
                      <User className="w-10 h-10 text-slate-300" />
                   )}
                </div>
                <div className={cn(
                   "absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white shadow-lg",
                   client.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
                )}></div>
             </div>

             <div>
                <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-3xl font-black tracking-tighter text-slate-900">{client.fullname}</h1>
                   {getStatusBadge(client.status)}
                </div>
                <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-primary" /> Member ID: {client.clientNo} <span className="opacity-40">|</span> <CreditCard className="w-4 h-4" /> NIC: {client.nic}
                </p>
             </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 h-11 px-6 font-bold">
             Edit Profile
           </Button>
        </div>
      </div>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-primary" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Paid</p>
              <p className="text-2xl font-black text-emerald-600">Rs. {stats?.totalPaid.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-2">Historical Collections</p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-rose-500">
              <Receipt className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Outstanding Balance</p>
              <p className="text-2xl font-black text-rose-500">Rs. {stats?.balance.toLocaleString()}</p>
              <p className="text-[10px] text-rose-500 font-bold mt-2">Remaining across all loans</p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
              <Briefcase className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Loan Portfolio</p>
              <p className="text-2xl font-black text-slate-800">{stats?.totalLoans} Applications</p>
              <p className="text-[10px] text-primary font-bold mt-2">{stats?.activeLoans} Currently Active</p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500">
              <Users className="w-12 h-12" />
           </div>
           <CardContent className="p-6">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Group Involvement</p>
              <p className="text-2xl font-black text-amber-600">{stats?.totalGroups} Groups</p>
              <p className="text-[10px] text-amber-600 font-bold mt-2">Active memberships</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client Details */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader className="border-b bg-muted/10">
                 <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                       <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Full Name</p>
                       <p className="text-sm font-bold text-slate-800">{client.fullname}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                       <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Phone Number</p>
                       <p className="text-sm font-bold text-slate-800">{client.phone}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                       <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">NIC Number</p>
                       <p className="text-sm font-bold text-slate-800">{client.nic}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                       <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Job / Occupation</p>
                       <p className="text-sm font-bold text-slate-800">{client.job || "Not Specified"}</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Residential Address</p>
                       <p className="text-xs font-semibold text-slate-600 leading-relaxed">{client.address || "No address provided"}</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader className="border-b bg-muted/10">
                 <CardTitle className="text-lg font-bold">Linked Groups</CardTitle>
                 <CardDescription>Groups this client belongs to</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                 {client.groupMembers?.map((gm: any) => (
                    <div key={gm.id} className="p-4 rounded-xl border bg-white/50 hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group" onClick={() => router.push(`/groups/${gm.groupId}`)}>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-primary/10">
                                <Users className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-800">{gm.group.name}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{gm.group.branch}</span>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary" />
                       </div>
                    </div>
                 ))}
                 {client.groupMembers?.length === 0 && (
                    <p className="text-center py-4 text-xs font-bold text-muted-foreground italic">No group associations found.</p>
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Right Column: Portfolio Tabs */}
        <div className="lg:col-span-2">
           <Tabs defaultValue="loans" className="w-full">
              <TabsList className="bg-card/40 backdrop-blur-md border h-14 p-1 gap-2 mb-6 justify-start">
                 <TabsTrigger value="loans" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full">
                    <Wallet className="h-4 w-4" />
                    Loans History
                 </TabsTrigger>
                 <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full">
                    <HistoryIcon className="h-4 w-4" />
                    Payment History
                 </TabsTrigger>
              </TabsList>

              <TabsContent value="loans" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto">
                       <Table>
                          <TableHeader className="bg-muted/30">
                             <TableRow>
                                <TableHead className="font-bold text-foreground">Loan No</TableHead>
                                <TableHead className="font-bold text-foreground">Group</TableHead>
                                <TableHead className="font-bold text-foreground text-right">Lent Amount</TableHead>
                                <TableHead className="font-bold text-foreground text-center">Status</TableHead>
                                <TableHead className="font-bold text-foreground text-right">Created</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody>
                             {/* Grouping instalments by loan for summary */}
                             {Object.values(client.instalments.reduce((acc: any, inst: any) => {
                                if (!acc[inst.loanId]) {
                                   acc[inst.loanId] = {
                                      id: inst.loan.id,
                                      loanNo: inst.loan.loanNo,
                                      group: inst.loan.group.name,
                                      lent: inst.loan.leaderLentAmount, // need to check if leader
                                      status: inst.loan.status,
                                      date: inst.loan.createdAt
                                   };
                                }
                                return acc;
                             }, {})).map((loan: any) => (
                                <TableRow key={loan.id} className="hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => router.push(`/loans/${loan.id}`)}>
                                   <TableCell className="font-black text-slate-800">{loan.loanNo}</TableCell>
                                   <TableCell className="text-sm font-bold text-slate-600">{loan.group}</TableCell>
                                   <TableCell className="text-right font-black text-primary">Rs. {Number(loan.lent).toLocaleString()}</TableCell>
                                   <TableCell className="text-center">
                                      <Badge variant="outline" className="font-black text-[9px] uppercase tracking-tighter">
                                         {loan.status}
                                      </Badge>
                                   </TableCell>
                                   <TableCell className="text-right text-xs font-semibold text-muted-foreground">{format(new Date(loan.date), "yyyy-MM-dd")}</TableCell>
                                </TableRow>
                             ))}
                             {client.instalments.length === 0 && (
                                <TableRow>
                                   <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic font-bold">No loans found for this client.</TableCell>
                                </TableRow>
                             )}
                          </TableBody>
                       </Table>
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="payments" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                       <Table>
                          <TableHeader className="sticky top-0 z-10 bg-slate-50">
                             <TableRow>
                                <TableHead className="font-bold text-foreground py-4">Due Date</TableHead>
                                <TableHead className="font-bold text-foreground">Loan Ref</TableHead>
                                <TableHead className="font-bold text-foreground text-right">Due</TableHead>
                                <TableHead className="font-bold text-foreground text-right">Paid</TableHead>
                                <TableHead className="font-bold text-foreground text-center">Status</TableHead>
                             </TableRow>
                          </TableHeader>
                          <TableBody>
                             {client.instalments.map((inst: any) => (
                                <TableRow key={inst.id} className="hover:bg-primary/5 transition-colors border-b">
                                   <TableCell className="py-4 text-xs font-bold text-slate-600">{format(new Date(inst.dueDate), "PPP")}</TableCell>
                                   <TableCell className="text-xs font-black text-slate-400">{inst.loan.loanNo}</TableCell>
                                   <TableCell className="text-right font-bold text-slate-800">Rs. {Number(inst.dueAmount).toLocaleString()}</TableCell>
                                   <TableCell className="text-right font-black text-emerald-600">Rs. {Number(inst.paidAmount).toLocaleString()}</TableCell>
                                   <TableCell className="text-center">
                                      <Badge className={cn(
                                         "font-black text-[8px] uppercase tracking-tighter border-none",
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
                 </Card>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  );
}
