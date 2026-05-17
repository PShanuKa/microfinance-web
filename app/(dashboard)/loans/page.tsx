"use client";
import { MapPin } from "lucide-react";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  XCircle,
  Eye,
  Trash2,
  Edit2Icon,
  Crown,
  Phone,
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
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TablePagination from "@/components/Custom/TablePagination";
import { useLoansQuery } from "@/services/loanApi";
import { Label } from "@/components/ui/label";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function LoansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openItem, setOpenItem] = useState<string[]>([]);

  // URL synced filters
  const statusFilter = searchParams.get("status") || "All";
  const collectionDayFilter = searchParams.get("collectionDay") || "All";

  // Function to update URL params
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
    setPage(1);
  };

  const { data, isLoading } = useLoansQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: statusFilter === "All" ? undefined : statusFilter,
    collectionDay: collectionDayFilter === "All" ? undefined : parseInt(collectionDayFilter),
  });

  const getStatusBadge = (status: string) => {
    const baseStyle =
      "border-none px-3 py-1 rounded-full font-bold text-white flex items-center gap-1 w-fit";
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            className={cn(baseStyle, "bg-emerald-500 hover:bg-emerald-600")}
          >
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className={cn(baseStyle, "bg-amber-500 hover:bg-amber-600")}>
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className={cn(baseStyle, "bg-rose-500 hover:bg-rose-600")}>
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className={cn(baseStyle, "bg-blue-500 hover:bg-blue-600")}>
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground px-3 py-1 rounded-full font-bold"
          >
            Draft
          </Badge>
        );
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
          <div className="flex flex-col md:flex-row items-center  p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-[80px] md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Name, Officer or Leader..."
                className="pl-10 h-10 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div
              className="flex items-center gap-3 w-full md:w-auto cursor-pointer "
              onClick={() =>
                setOpenItem((prev) =>
                  prev.includes("item-1") ? [] : ["item-1"],
                )
              }
            >
              filters
            </div>
          </div>

          <Accordion
                      value={openItem}
                      onValueChange={setOpenItem}
                      className="w-full border-none"
                    >
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionContent className="px-4 py-4 border-b bg-muted/20">
                          <div className="flex flex-col md:flex-row items-end gap-4">
                            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                              <Label className="text-xs text-muted-foreground ml-1">Status</Label>
                              <Select
                                value={statusFilter}
                                onValueChange={(val) => updateFilters({ status: val || "All" })}
                              >
                                <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                                  <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter Status" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="All">All Statuses</SelectItem>
                                  <SelectItem value="PENDING">Pending</SelectItem>
                                  <SelectItem value="APPROVED">Approved</SelectItem>
                                  <SelectItem value="REJECTED">Rejected</SelectItem>
                                  <SelectItem value="COMPLETED">Completed</SelectItem>
                                  <SelectItem value="DRAFT">Draft</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
          
                            <div className="flex flex-col gap-1.5 w-full md:w-auto">
                              <Label className="text-xs text-muted-foreground ml-1">Collection Day</Label>
                              <Select
                                value={collectionDayFilter}
                                onValueChange={(val) => updateFilters({ collectionDay: val || "All" })}
                              >
                                <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Collection Day" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="All">All Days</SelectItem>
                                  {DAYS.map((day, idx) => (
                                    <SelectItem key={day} value={(idx + 1).toString()}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {(statusFilter !== "All" || collectionDayFilter !== "All") && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateFilters({ status: "All", collectionDay: "All" })}
                                className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[120px] font-bold text-foreground">
                    Loan ID
                  </TableHead>
                  <TableHead className="w-[180px] font-bold text-foreground">
                    Group & Branch
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Group Leader
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Lent (L/M)
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Weekly (L/M)
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Proc. Fee
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
                    Duration
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Loading loans...
                    </TableCell>
                  </TableRow>
                ) : data?.loans?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No loans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.loans?.map((loan: any) => (
                    <TableRow
                      key={loan.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {loan.loanNo}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            {loan.id.substring(0, 8)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {loan.group?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {loan.group?.branch}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const leaderMember = loan.group?.members?.[0];
                          const leader = leaderMember?.client;
                          if (!leader)
                            return (
                              <span className="text-xs text-muted-foreground italic">
                                No Leader
                              </span>
                            );
                          return (
                            <div className="flex flex-col">
                              <span className="text-sm font-bold flex items-center gap-1">
                                <Crown className="h-3 w-3 text-amber-500" />
                                {leader.fullname}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Phone className="h-2.5 w-2.5" />
                                {leader.phone}
                              </span>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-foreground">
                            Rs. {Number(loan.leaderLentAmount).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            M: Rs.{" "}
                            {Number(loan.memberLentAmount).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-600">
                            Rs.{" "}
                            {Number(loan.leaderWeeklyAmount).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            M: Rs.{" "}
                            {Number(loan.memberWeeklyAmount).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm font-medium text-muted-foreground">
                          Rs. {Number(loan.processingFee).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {loan.totalWeeks} Weeks
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 bg-card/95 backdrop-blur-md"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>
                                Loan Actions
                              </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => router.push(`/loans/${loan.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Details
                            </DropdownMenuItem>

                            {loan.status === "PENDING" && (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-emerald-600"
                                onClick={() =>
                                  router.push(`/loans/${loan.id}/edit-schedule`)
                                }
                              >
                                <Edit2Icon className="h-4 w-4" />
                                Edit Schedule
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => router.push(`/loans/${loan.id}`)}
                            >
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
            <TablePagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
