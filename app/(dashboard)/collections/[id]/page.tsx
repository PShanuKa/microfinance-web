"use client";

import React from "react";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Search, 
  User, 
  Users,
  CreditCard,
  Building,
  Receipt,
  Download,
  AlertCircle,
  Banknote,
  MoreVertical,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Badge } from "@/components/ui/badge";
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

export default function CollectionViewPage() {
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id || "COL-001";

  // Mock data for the specific collection
  const collectionDetails = {
    id: collectionId,
    date: "2026-05-12",
    group: "Sunlight Group",
    week: 10,
    collector: "Saman Perera",
    amount: 18750,
    bankRef: "DEP-99812",
    status: "Verified",
    verifiedBy: "Admin Sarah",
    verifiedAt: "2026-05-12 04:30 PM",
    branch: "Colombo North",
    notes: "All members paid in full. Group leader coordinated the collection at the center.",
  };

  const memberPayments = [
    { id: "C-001", name: "Anura Kumara", due: 1250, paid: 1250, status: "Full Paid" },
    { id: "C-002", name: "Sunil Perera", due: 750, paid: 750, status: "Full Paid" },
    { id: "C-004", name: "Kamal Gunarathne", due: 750, paid: 750, status: "Full Paid" },
    { id: "C-005", name: "Saman Kumara", due: 1000, paid: 1000, status: "Full Paid" },
    { id: "C-008", name: "Nimali Siri", due: 1000, paid: 1000, status: "Full Paid" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
             <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{collectionDetails.id}</h1>
                <Badge className="bg-emerald-500">{collectionDetails.status}</Badge>
             </div>
             <p className="text-sm text-muted-foreground">{collectionDetails.group} • Week {collectionDetails.week}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Printer className="h-4 w-4" />
             Print Receipt
           </Button>
           <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
             <Download className="h-4 w-4" />
             Export Slip
           </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Banknote className="h-16 w-16" />
           </div>
           <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Collected</p>
              <p className="text-3xl font-black text-emerald-600 mt-2">Rs. {collectionDetails.amount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                 <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                 Verified by {collectionDetails.verifiedBy}
              </p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Receipt className="h-16 w-16" />
           </div>
           <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bank Reference</p>
              <p className="text-3xl font-black text-primary mt-2">{collectionDetails.bankRef}</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                 <Calendar className="h-3 w-3" />
                 Deposited on {collectionDetails.date}
              </p>
           </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="h-16 w-16" />
           </div>
           <CardContent className="p-6">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Group Members</p>
              <p className="text-3xl font-black text-foreground mt-2">{memberPayments.length} Paid</p>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
                 <Info className="h-3 w-3 text-primary" />
                 100% Attendance for Week {collectionDetails.week}
              </p>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Table */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Users className="h-5 w-5 text-primary" />
                 Collection Breakdown
              </CardTitle>
              <CardDescription>Individual member payment details for this collection.</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="rounded-xl border border-muted/50 overflow-hidden">
                 <Table>
                    <TableHeader>
                       <TableRow className="bg-muted/30">
                          <TableHead className="font-bold">Member</TableHead>
                          <TableHead className="font-bold">Due Amount</TableHead>
                          <TableHead className="font-bold">Collected</TableHead>
                          <TableHead className="text-right font-bold">Status</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {memberPayments.map((member) => (
                         <TableRow key={member.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell>
                               <div className="flex flex-col">
                                  <span className="font-bold">{member.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase">{member.id}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-sm font-medium text-muted-foreground italic">Rs. {member.due.toLocaleString()}</TableCell>
                            <TableCell className="font-black text-emerald-600">Rs. {member.paid.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                               <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-bold">
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

        {/* Info & Metadata */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-muted/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Collector</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                       <User className="h-3 w-3 text-primary" />
                       {collectionDetails.collector}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-muted/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Branch</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                       <Building className="h-3 w-3 text-primary" />
                       {collectionDetails.branch}
                    </span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-muted/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Verified At</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                       <Clock className="h-3 w-3 text-emerald-500" />
                       {collectionDetails.verifiedAt}
                    </span>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                 <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 italic text-sm text-muted-foreground leading-relaxed">
                    "{collectionDetails.notes}"
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg">Bank Slip</CardTitle>
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <Download className="h-4 w-4" />
                 </Button>
              </CardHeader>
              <CardContent>
                 <div className="aspect-[4/3] rounded-xl bg-muted/50 border border-muted flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-colors">
                    <FileText className="h-12 w-12 text-muted-foreground/30" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button size="sm" className="gap-2">
                          <Search className="h-4 w-4" />
                          View Full Screen
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
