"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  History as HistoryIcon, 
  Info, 
  MoreVertical, 
  Plus, 
  Printer, 
  Search, 
  Upload, 
  User, 
  Users,
  CreditCard,
  Building,
  TrendingUp,
  Download,
  Trash2
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

export default function LoanViewPage() {
  const router = useRouter();
  const params = useParams();
  const loanId = params.id || "LN-001";

  // Mock data for the specific loan
  const loanDetails = {
    id: loanId,
    client: "Anura Kumara",
    group: "Sunlight Group",
    principal: 50000,
    paid: 12500,
    balance: 37500,
    weeks: 50,
    weeksPaid: 10,
    status: "Active",
    officer: "Saman Perera",
    branch: "Colombo North",
    issuedDate: "2026-03-01",
    processingFee: 1000,
  };

  const scheduleData = [
    { week: 1, date: "2026-03-08", amount: 1250, status: "Paid", paidDate: "2026-03-08" },
    { week: 2, date: "2026-03-15", amount: 1250, status: "Paid", paidDate: "2026-03-16" },
    { week: 3, date: "2026-03-22", amount: 1250, status: "Paid", paidDate: "2026-03-22" },
    { week: 11, date: "2026-05-17", amount: 1250, status: "Pending", paidDate: "-" },
    { week: 12, date: "2026-05-24", amount: 1250, status: "Pending", paidDate: "-" },
  ];

  const membersData = [
    { id: "C-001", name: "Anura Kumara", role: "Leader", amount: 50000, paid: 12500, status: "On-Track" },
    { id: "C-002", name: "Sunil Perera", role: "Member", amount: 30000, paid: 7500, status: "On-Track" },
    { id: "C-004", name: "Kamal Gunarathne", role: "Member", amount: 30000, paid: 6000, status: "Delayed" },
  ];

  const historyData = [
    { event: "Loan Issued", date: "2026-03-01 10:45 AM", user: "Admin", note: "Loan approved and funds disbursed." },
    { event: "Document Uploaded", date: "2026-03-01 11:00 AM", user: "Officer Saman", note: "Agreement signed by all members." },
    { event: "10th Payment Received", date: "2026-05-10 09:20 AM", user: "System", note: "Automatic recording of weekly collection." },
  ];

  const [documents, setDocuments] = useState([
    { name: "Loan_Agreement_V1.pdf", type: "PDF", size: "1.2 MB", date: "2026-03-01" },
    { name: "Client_NIC_Scans.zip", type: "ZIP", size: "4.5 MB", date: "2026-03-01" },
  ]);

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
             <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{loanDetails.id}</h1>
                <Badge className="bg-emerald-500">{loanDetails.status}</Badge>
             </div>
             <p className="text-sm text-muted-foreground">{loanDetails.client} • {loanDetails.group}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Printer className="h-4 w-4" />
             Print
           </Button>
           <Button size="sm" className="gap-2">
             <Download className="h-4 w-4" />
             Download PDF
           </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
           <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Principal</p>
                 <p className="text-2xl font-black">Rs. {loanDetails.principal.toLocaleString()}</p>
                 <div className="flex items-center gap-1 mt-2 text-xs text-primary font-bold">
                    <TrendingUp className="h-3 w-3" />
                    Issued on {loanDetails.issuedDate}
                 </div>
              </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
           <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Paid</p>
                 <p className="text-2xl font-black text-emerald-600">Rs. {loanDetails.paid.toLocaleString()}</p>
                 <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {loanDetails.weeksPaid} of {loanDetails.weeks} weeks
                 </div>
              </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
           <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Outstanding</p>
                 <p className="text-2xl font-black text-rose-500">Rs. {loanDetails.balance.toLocaleString()}</p>
                 <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 text-rose-500" />
                    {loanDetails.weeks - loanDetails.weeksPaid} weeks remaining
                 </div>
              </div>
           </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
           <CardContent className="p-6">
              <div className="flex flex-col gap-1">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</p>
                 <div className="flex items-end gap-2">
                    <p className="text-2xl font-black">{Math.round((loanDetails.paid / loanDetails.principal) * 100)}%</p>
                    <div className="flex-1 h-2 bg-muted rounded-full mb-2 overflow-hidden">
                       <div 
                         className="h-full bg-primary" 
                         style={{ width: `${(loanDetails.paid / loanDetails.principal) * 100}%` }} 
                       />
                    </div>
                 </div>
                 <p className="text-xs text-muted-foreground font-medium mt-1">Repayment Status</p>
              </div>
           </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="details" className="rounded-lg gap-2">
            <Info className="h-4 w-4" />
            Loan Details
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg gap-2">
            <Calendar className="h-4 w-4" />
            Payment Schedule
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-lg gap-2">
            <Users className="h-4 w-4" />
            Member Status
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2">
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader>
                   <CardTitle className="text-lg">General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-xs text-muted-foreground font-semibold">Group Name</p>
                         <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <Users className="h-4 w-4 text-primary" />
                            {loanDetails.group}
                         </p>
                      </div>
                      <div>
                         <p className="text-xs text-muted-foreground font-semibold">Collection Officer</p>
                         <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-primary" />
                            {loanDetails.officer}
                         </p>
                      </div>
                      <div>
                         <p className="text-xs text-muted-foreground font-semibold">Branch</p>
                         <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <Building className="h-4 w-4 text-primary" />
                            {loanDetails.branch}
                         </p>
                      </div>
                      <div>
                         <p className="text-xs text-muted-foreground font-semibold">Processing Fee</p>
                         <p className="text-sm font-bold flex items-center gap-2 mt-1">
                            <CreditCard className="h-4 w-4 text-primary" />
                            Rs. {loanDetails.processingFee.toLocaleString()}
                         </p>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                <CardHeader>
                   <CardTitle className="text-lg">Terms Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-muted/50">
                      <span className="text-sm text-muted-foreground">Total Duration</span>
                      <span className="font-bold">{loanDetails.weeks} Weeks</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-muted/50">
                      <span className="text-sm text-muted-foreground">Repayment Frequency</span>
                      <span className="font-bold uppercase">Weekly</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-muted/50">
                      <span className="text-sm text-muted-foreground">Weekly Payment (Group Total)</span>
                      <span className="font-bold text-emerald-600">Rs. 3,750</span>
                   </div>
                </CardContent>
             </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                   <CardTitle>Repayment Schedule</CardTitle>
                   <CardDescription>Track weekly payment dates and status.</CardDescription>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                   <Printer className="h-4 w-4" />
                   Print Schedule
                </Button>
             </CardHeader>
             <CardContent>
                <Table>
                   <TableHeader>
                      <TableRow className="bg-muted/30">
                         <TableHead className="font-bold">Week</TableHead>
                         <TableHead className="font-bold">Due Date</TableHead>
                         <TableHead className="font-bold">Amount Due</TableHead>
                         <TableHead className="font-bold">Paid Date</TableHead>
                         <TableHead className="font-bold text-center">Status</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {scheduleData.map((item) => (
                        <TableRow key={item.week} className="hover:bg-primary/5 transition-colors">
                           <TableCell className="font-bold">Week {item.week}</TableCell>
                           <TableCell className="text-sm">{item.date}</TableCell>
                           <TableCell className="font-bold text-primary">Rs. {item.amount.toLocaleString()}</TableCell>
                           <TableCell className="text-sm text-muted-foreground">{item.paidDate}</TableCell>
                           <TableCell className="text-center">
                              <Badge variant={item.status === "Paid" ? "default" : "outline"} 
                                className={cn(
                                  "font-bold",
                                  item.status === "Paid" ? "bg-emerald-500 text-white border-none" : "border-amber-500/50 text-amber-600"
                                )}
                              >
                                {item.status}
                              </Badge>
                           </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/10 italic">
                         <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                            ... and {loanDetails.weeks - scheduleData.length} more weeks
                         </TableCell>
                      </TableRow>
                   </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
             <CardHeader>
                <CardTitle>Member Loan Status</CardTitle>
                <CardDescription>Individual repayment tracking for group members.</CardDescription>
             </CardHeader>
             <CardContent>
                <Table>
                   <TableHeader>
                      <TableRow className="bg-muted/30">
                         <TableHead className="font-bold">Member Name</TableHead>
                         <TableHead className="font-bold">Role</TableHead>
                         <TableHead className="font-bold">Amount Lent</TableHead>
                         <TableHead className="font-bold">Paid Amount</TableHead>
                         <TableHead className="font-bold">Remaining</TableHead>
                         <TableHead className="font-bold text-right">Status</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {membersData.map((member) => (
                        <TableRow key={member.id} className="hover:bg-primary/5 transition-colors group">
                           <TableCell>
                              <div className="flex flex-col">
                                 <span className="font-bold">{member.name}</span>
                                 <span className="text-xs text-muted-foreground">{member.id}</span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge variant="outline" className={cn(
                                "text-[10px] font-bold uppercase",
                                member.role === "Leader" ? "border-amber-500/50 text-amber-600" : "border-primary/50 text-primary"
                              )}>
                                {member.role}
                              </Badge>
                           </TableCell>
                           <TableCell className="font-semibold">Rs. {member.amount.toLocaleString()}</TableCell>
                           <TableCell className="font-semibold text-emerald-600">Rs. {member.paid.toLocaleString()}</TableCell>
                           <TableCell className="font-semibold text-rose-500">Rs. {(member.amount - member.paid).toLocaleString()}</TableCell>
                           <TableCell className="text-right">
                              <Badge className={cn(
                                "font-bold",
                                member.status === "On-Track" ? "bg-emerald-500" : "bg-amber-500"
                              )}>
                                {member.status}
                              </Badge>
                           </TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                 <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                    <CardHeader>
                       <CardTitle>Uploaded Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-3">
                          {documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors group">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                     <FileText className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold">{doc.name}</p>
                                     <p className="text-xs text-muted-foreground">{doc.type} • {doc.size} • {doc.date}</p>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <Button variant="ghost" size="icon" className="rounded-full">
                                     <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="rounded-full text-destructive">
                                     <Trash2 className="h-4 w-4" />
                                  </Button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>
              <div className="md:col-span-1">
                 <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
                    <CardHeader>
                       <CardTitle className="text-lg">Upload New</CardTitle>
                       <CardDescription>Add additional scans or documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="flex flex-col items-center gap-2">
                             <Upload className="h-6 w-6 text-muted-foreground" />
                             <p className="text-xs font-semibold">Click to upload</p>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
             <CardHeader>
                <CardTitle>Loan History & Activity</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-muted">
                   {historyData.map((item, i) => (
                     <div key={i} className="relative pl-10">
                        <div className="absolute left-0 top-1 w-[34px] h-[34px] rounded-full bg-background border-2 border-primary flex items-center justify-center z-10 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-foreground">{item.event}</h4>
                              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">{item.date}</span>
                           </div>
                           <p className="text-xs text-muted-foreground">{item.note}</p>
                           <p className="text-[10px] font-semibold text-primary mt-1 flex items-center gap-1">
                              <User className="h-2.5 w-2.5" />
                              By {item.user}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
