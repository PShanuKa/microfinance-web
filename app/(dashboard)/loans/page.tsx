"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Search, Filter, HandCoins, Users, Calendar, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
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
    client: "Anura Kumara",
    group: "Sunlight Group",
    principal: 50000,
    weeklyTotal: 1250,
    weeks: 50,
    status: "Active",
  },
  {
    id: "LN-002",
    client: "Sunil Perera",
    group: "Sunlight Group",
    principal: 30000,
    weeklyTotal: 750,
    weeks: 50,
    status: "Active",
  },
  {
    id: "LN-003",
    client: "Kamal Siri",
    group: "Prosperity Circle",
    principal: 100000,
    weeklyTotal: 2500,
    weeks: 48,
    status: "Pending",
  },
  {
    id: "LN-004",
    client: "Nimali Siri",
    group: "Helping Hands",
    principal: 20000,
    weeklyTotal: 500,
    weeks: 40,
    status: "Closed",
  },
];

export default function LoansPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLoans = loansData.filter((loan) => {
    const matchesSearch =
      loan.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.group.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Loans"
        description="Monitor active loans, repayment schedules, and processing status"
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
                placeholder="Search by loan ID, client, or group..."
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[180px] font-bold text-foreground">Loan</TableHead>
                  <TableHead className="font-bold text-foreground">Group</TableHead>
                  <TableHead className="font-bold text-foreground">Principal</TableHead>
                  <TableHead className="font-bold text-foreground">Weekly Total</TableHead>
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
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{loan.client}</span>
                          <span className="text-xs text-muted-foreground">{loan.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {loan.group}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-foreground">
                          <span className="text-xs text-muted-foreground">Rs.</span>
                          {loan.principal.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                          <span className="text-xs opacity-70">Rs.</span>
                          {loan.weeklyTotal.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {loan.weeks}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            loan.status === "Active" ? "default" : 
                            loan.status === "Pending" ? "outline" : "secondary"
                          }
                          className={cn(
                            "font-bold px-3 py-1 rounded-full border-none",
                            loan.status === "Active" && "bg-emerald-500 hover:bg-emerald-600 text-white",
                            loan.status === "Pending" && "bg-amber-500 hover:bg-amber-600 text-white",
                            loan.status === "Closed" && "bg-slate-500 hover:bg-slate-600 text-white"
                          )}
                        >
                          {loan.status === "Active" && <Clock className="mr-1 h-3 w-3" />}
                          {loan.status === "Closed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <div
                             
                        
                              className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-md">
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
                              <FileText className="h-4 w-4 text-amber-500" />
                              Loan Documents
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
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
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
