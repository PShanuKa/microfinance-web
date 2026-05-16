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
  ClipboardList,
  TrendingUp,
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
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCollectionsQuery } from "@/services/collectionApi";

export default function CollectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading } = useCollectionsQuery();
  const collections = data?.collections || [];

  const filteredData = collections.filter((col: any) => 
    col.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    col.groupNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Verified: "bg-emerald-500 hover:bg-emerald-600",
      Pending: "bg-amber-500 hover:bg-amber-600",
      Disputed: "bg-rose-500 hover:bg-rose-600",
    };
    return (
      <Badge
        className={cn(
          "font-bold text-[10px] uppercase px-2 py-0.5 border-none text-white",
          colors[status] || "bg-slate-500",
        )}
      >
        {status}
      </Badge>
    );
  };

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
        <Card className="border-none shadow-lg bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Calendar className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Today's Expected Collection
            </p>
            <p className="text-2xl font-black mt-2">Rs. 56,250</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-white/20 border-none text-[9px] font-black uppercase">
                Schedule: 12 Groups
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-emerald-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Banknote className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Today's Collected Amount
            </p>
            <p className="text-2xl font-black mt-2">Rs. 43,750</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-[77%]" />
              </div>
              <span className="text-[10px] font-black">77% Recovered</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-rose-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              My Total Outstanding
            </p>
            <p className="text-2xl font-black mt-2">Rs. 12,500</p>
            <div className="mt-4 flex items-center gap-2 text-white/60">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Due from 3 members
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Collection Efficiency
            </p>
            <p className="text-4xl font-black mt-2 tracking-tighter">77.8%</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-primary/20 text-primary-foreground px-2 py-0.5 rounded-full tracking-widest">
                Performance Tag
              </span>
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
              <Button
                variant="outline"
                className="gap-2 h-11 rounded-lg font-bold"
              >
                <Calendar className="h-4 w-4" />
                Today
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-11 rounded-lg font-bold"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">
                    Group No / Name
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Location / Center
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Leader Name & Phone
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
                    Members
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
                    Ins. No
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Expected
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Arrears
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Total Due
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Collected
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
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
                    <TableCell colSpan={11} className="h-32 text-center text-muted-foreground font-medium italic">
                      Loading collections...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center text-muted-foreground font-medium italic">
                      No collections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((col: any) => {
                    const expected = Number(col.expected || 0);
                    const arrears = Number(col.arrears || 0);
                    const collected = Number(col.amountCollected || 0);
                    const totalDue = expected + arrears;
                    
                    return (
                      <TableRow
                        key={col.id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <TableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
                          <div className="flex flex-col">
                            <span>{col.groupNo || col.group?.groupNo}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              {col.groupName || col.group?.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{col.location || col.group?.location}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {col.center || col.group?.center}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{col.leader || col.group?.leaderName}</span>
                            <span className="text-[10px] text-primary font-bold uppercase">
                              {col.phone || col.group?.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-bold text-xs">
                            {col.members || col.group?.memberCount || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-600">
                          #{col.instalmentNumber}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-600">
                          Rs. {expected.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-rose-500">
                          {arrears > 0 ? `Rs. ${arrears.toLocaleString()}` : "0"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-900">
                          Rs. {totalDue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          Rs. {collected.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(col.status || "Pending")}
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
                                onClick={() =>
                                  router.push(`/collections/${col.id}`)
                                }
                                className="gap-2 cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-primary" /> View
                                Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <ClipboardList className="h-4 w-4 text-blue-500" />{" "}
                                Add Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <FileUp className="h-4 w-4 text-amber-500" />{" "}
                                Attach Docs
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />{" "}
                                Verify Deposit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
