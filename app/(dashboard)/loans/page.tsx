"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Search, Filter, HandCoins, Users, Calendar, ArrowUpRight, CheckCircle2, Clock, FileCheck, XCircle, Ban, FileUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit2, Trash2, FileText } from "lucide-react";

const loansData = [
  {
    id: "LN-001",
    group: "Sunlight Group",
    totalPrincipal: 500000,
    leaderWeeklyAmount: 2500,
    memberWeeklyAmount: 2000,
    processingFee: 5000,
    weeks: 50,
    status: "Active",
  },
  {
    id: "LN-002",
    group: "Prosperity Circle",
    totalPrincipal: 300000,
    leaderWeeklyAmount: 1500,
    memberWeeklyAmount: 1200,
    processingFee: 3000,
    weeks: 50,
    status: "Pending approval",
  },
  {
    id: "LN-003",
    group: "Helping Hands",
    totalPrincipal: 1000000,
    leaderWeeklyAmount: 5000,
    memberWeeklyAmount: 4000,
    processingFee: 10000,
    weeks: 48,
    status: "Approved",
  },
  {
    id: "LN-004",
    group: "Golden Harvest",
    totalPrincipal: 200000,
    leaderWeeklyAmount: 1000,
    memberWeeklyAmount: 800,
    processingFee: 2000,
    weeks: 40,
    status: "Draft",
  },
];

export default function LoansPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLoans = loansData.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1 rounded-full font-bold"><Clock className="mr-1 h-3 w-3" />Active</Badge>;
      case "Pending approval":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none px-3 py-1 rounded-full font-bold"><Clock className="mr-1 h-3 w-3" />Pending Approval</Badge>;
      case "Approved":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-3 py-1 rounded-full font-bold"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none px-3 py-1 rounded-full font-bold"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      case "Completed":
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white border-none px-3 py-1 rounded-full font-bold"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>;
      case "Draft":
        return <Badge variant="outline" className="text-muted-foreground px-3 py-1 rounded-full font-bold">Draft</Badge>;
      case "Written-off / Cancelled":
        return <Badge className="bg-slate-800 hover:bg-slate-900 text-white border-none px-3 py-1 rounded-full font-bold"><Ban className="mr-1 h-3 w-3" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Loans"
        description="Monitor group-based loans, repayment schedules, and processing status"
      >
        <Button 
          onClick={() => router.push("/loans/create")}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          New Loan
        </Button>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by loan ID or group..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-11 bg-background/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending approval">Pending Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Written-off / Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[180px] font-bold text-foreground">Loan ID & Group</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Total Principal</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Leader Weekly</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Member Weekly</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Proc. Fee</TableHead>
                  <TableHead className="font-bold text-foreground">Weeks</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{loan.group}</span>
                          <span className="text-xs text-muted-foreground font-mono">{loan.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-foreground">
                          <span className="text-xs text-muted-foreground mr-1">Rs.</span>
                          {loan.totalPrincipal.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-emerald-600">
                          <span className="text-xs opacity-70 mr-1">Rs.</span>
                          {loan.leaderWeeklyAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-emerald-600">
                          <span className="text-xs opacity-70 mr-1">Rs.</span>
                          {loan.memberWeeklyAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">
                          <span className="text-xs mr-1">Rs.</span>
                          {loan.processingFee.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {loan.weeks}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(loan.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Loan Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => router.push(`/loans/${loan.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <FileCheck className="h-4 w-4 text-blue-500" />
                              Approve/Reject Loan
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <FileUp className="h-4 w-4 text-amber-500" />
                              View/Upload Attachments
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                              Make Payment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Terminate Loan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No loans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

