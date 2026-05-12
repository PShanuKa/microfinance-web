"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  Wallet, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  FileText,
  Banknote,
  Receipt,
  FileUp,
  ClipboardList
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

const collectionsData = [
  {
    id: "COL-001",
    date: "2026-05-12",
    group: "Sunlight Group",
    week: 10,
    collector: "Saman Perera",
    amount: 18750,
    remainingDue: 0,
    bankRef: "DEP-99812",
    status: "Verified",
  },
  {
    id: "COL-002",
    date: "2026-05-12",
    group: "Prosperity Circle",
    week: 12,
    collector: "Kamal Siri",
    amount: 25000,
    remainingDue: 5000,
    bankRef: "DEP-99815",
    status: "Verified",
  },
  {
    id: "COL-003",
    date: "2026-05-13",
    group: "Helping Hands",
    week: 5,
    collector: "Saman Perera",
    amount: 7500,
    remainingDue: 2500,
    bankRef: "PENDING",
    status: "Pending",
  },
];

export default function CollectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Collections"
        description="Track daily loan repayments, group collections, and bank deposits."
      >
        <Button 
          onClick={() => router.push("/collections/create")}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      </PageHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Total Collected</p>
                <p className="text-2xl font-black mt-1">Rs. 1,450,000</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                 <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Today Collected</p>
                <p className="text-2xl font-black mt-1">Rs. 43,750</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                 <Banknote className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-amber-500 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Today Pending</p>
                <p className="text-2xl font-black mt-1">Rs. 12,500</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                 <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Collections</p>
                <p className="text-2xl font-black mt-1">12 Groups</p>
              </div>
              <div className="p-2 bg-muted rounded-lg text-primary">
                 <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by group or collector..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <Button variant="outline" className="gap-2 h-11 rounded-lg">
                 <Calendar className="h-4 w-4" />
                 Today
               </Button>
               <Button variant="outline" className="gap-2 h-11 rounded-lg">
                 <Filter className="h-4 w-4" />
                 Filter
               </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Date</TableHead>
                  <TableHead className="font-bold text-foreground">Group</TableHead>
                  <TableHead className="font-bold text-foreground">Week</TableHead>
                  <TableHead className="font-bold text-foreground">Collector</TableHead>
                  <TableHead className="font-bold text-foreground">Amount</TableHead>
                  <TableHead className="font-bold text-foreground">Remaining Due</TableHead>
                  <TableHead className="font-bold text-foreground">Bank Ref</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionsData.map((col) => (
                  <TableRow key={col.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="font-medium text-sm">{col.date}</TableCell>
                    <TableCell className="font-bold text-foreground">{col.group}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-bold">Week {col.week}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{col.collector}</TableCell>
                    <TableCell className="font-black text-emerald-600">Rs. {col.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-rose-500">
                      {col.remainingDue > 0 ? `Rs. ${col.remainingDue.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground">
                        <Receipt className="h-3 w-3" />
                        {col.bankRef}
                      </div>
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
                              <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => router.push(`/collections/${col.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <FileText className="h-4 w-4 text-primary" />
                              View Breakdown
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <ClipboardList className="h-4 w-4 text-blue-500" />
                              Add Breakdown Details (Notes)
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <FileUp className="h-4 w-4 text-amber-500" />
                              Attach Documents (Tally sheets, receipts)
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                              Verify Deposit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Clock className="h-4 w-4" />
                              Mark Disputed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

