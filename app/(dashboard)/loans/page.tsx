"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  HandCoins, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  XCircle, 
  Ban, 
  FileUp,
  Eye,
  Trash2,
  FileText
} from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLoansQuery } from "@/services/loanApi";
import { format } from "date-fns";

export default function LoansPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data, isLoading } = useLoansQuery({ 
    page, 
    limit: 10, 
    search: searchTerm,
    status: statusFilter === "All" ? undefined : statusFilter 
  });

  const getStatusBadge = (status: string) => {
    const baseStyle = "border-none px-3 py-1 rounded-full font-bold text-white flex items-center gap-1 w-fit";
    switch (status) {
      case "APPROVED":
        return <Badge className={cn(baseStyle, "bg-emerald-500 hover:bg-emerald-600")}><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case "PENDING":
        return <Badge className={cn(baseStyle, "bg-amber-500 hover:bg-amber-600")}><Clock className="h-3 w-3" />Pending</Badge>;
      case "REJECTED":
        return <Badge className={cn(baseStyle, "bg-rose-500 hover:bg-rose-600")}><XCircle className="h-3 w-3" />Rejected</Badge>;
      case "COMPLETED":
        return <Badge className={cn(baseStyle, "bg-blue-500 hover:bg-blue-600")}><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className="text-muted-foreground px-3 py-1 rounded-full font-bold">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4 pb-10">
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
                placeholder="Search by group name..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger className="w-full md:w-[180px] h-11 bg-background/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[200px] font-bold text-foreground">Group & Branch</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Lent (L/M)</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Weekly (L/M)</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Proc. Fee</TableHead>
                  <TableHead className="font-bold text-foreground">Duration</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Loading loans...</TableCell>
                  </TableRow>
                ) : data?.loans?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No loans found.</TableCell>
                  </TableRow>
                ) : (
                  data?.loans?.map((loan: any) => (
                    <TableRow key={loan.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{loan.group?.name}</span>
                          <span className="text-xs text-muted-foreground">{loan.group?.branch}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-foreground">Rs. {Number(loan.leaderLentAmount).toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">M: Rs. {Number(loan.memberLentAmount).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-600">Rs. {Number(loan.leaderWeeklyAmount).toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground">M: Rs. {Number(loan.memberWeeklyAmount).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">
                          Rs. {Number(loan.processingFee).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {loan.totalWeeks} Weeks
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(loan.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
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
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="p-4 border-t bg-muted/20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} 
                      className={cn(page === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  
                  {[...Array(data.pagination.totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page < data.pagination.totalPages) setPage(page + 1); }}
                      className={cn(page === data.pagination.totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
