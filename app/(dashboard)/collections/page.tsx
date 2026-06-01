"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  Search,
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
  X,
  Filter,
  Building,
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

import { useCollectionsQuery, useDailyRegistryQuery } from "@/services/collectionApi";
import { useGetMeQuery } from "@/services/authApi";
import { useBranchesQuery } from "@/services/branchApi";
import TablePagination from "@/components/Custom/TablePagination";
import { format } from "date-fns";
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";
import { Label } from "@/components/ui/label";

export default function CollectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ALL");
  const [branchId, setBranchId] = useState("ALL");

  const { data: userData } = useGetMeQuery();
  const user = userData?.user;
  const isBranchManager = user?.roles?.includes("BRANCH_MANAGER");

  const { data: branchesData } = useBranchesQuery();
  const branches = branchesData?.branches || [];

  const { data, isLoading } = useCollectionsQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status === "ALL" ? undefined : status,
    branchId: isBranchManager ? user?.branchId : (branchId === "ALL" ? undefined : branchId),
  });
  const collections = data?.collections || [];

  const { data: registryData } = useDailyRegistryQuery();
  const dailyRegistry = registryData?.registry || [];
  
  const todaysExpected = dailyRegistry.reduce((acc: number, curr: any) => acc + Number(curr.expected || 0) + Number(curr.arrears || 0), 0);
  const todaysCollected = dailyRegistry.reduce((acc: number, curr: any) => acc + Number(curr.collected || 0), 0);
  const scheduleGroupsCount = dailyRegistry.length;
  const recoveryRate = todaysExpected > 0 ? ((todaysCollected / todaysExpected) * 100).toFixed(1) : "0.0";
  const outstandingAmount = Math.max(0, todaysExpected - todaysCollected);
  const groupsWithOutstanding = dailyRegistry.filter((g: any) => g.status !== "PAID").length;

  const filteredData = collections.filter((col: any) => {
    const term = searchTerm.toLowerCase();
    return (
      col.groupName?.toLowerCase().includes(term) ||
      col.groupNo?.toLowerCase().includes(term) ||
      col.id?.toLowerCase().includes(term) ||
      col.leader?.toLowerCase().includes(term) ||
      col.group?.members?.some((m: any) => m.client?.fullname?.toLowerCase().includes(term)) ||
      col.group?.members?.some((m: any) => m.client?.clientNo?.toLowerCase().includes(term)) ||
      col.group?.members?.some((m: any) => m.client?.nic?.toLowerCase().includes(term))
    );
  });

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
            <p className="text-2xl font-black mt-2">Rs. {todaysExpected.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-white/20 border-none text-[9px] font-black uppercase">
                Schedule: {scheduleGroupsCount} Groups
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
            <p className="text-2xl font-black mt-2">Rs. {todaysCollected.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 w-24 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${recoveryRate}%` }} />
              </div>
              <span className="text-[10px] font-black">{recoveryRate}% Recovered</span>
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
            <p className="text-2xl font-black mt-2">Rs. {outstandingAmount.toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-white/60">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Due from {groupsWithOutstanding} groups
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
            <p className="text-4xl font-black mt-2 tracking-tighter">{recoveryRate}%</p>
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
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search by group, ID, leader, or member..."
          >
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Date Range</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full md:w-[140px] h-10 bg-background/50"
                  />
                  <span className="text-xs font-bold text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full md:w-[140px] h-10 bg-background/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full md:w-[160px] h-10 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="SUBMITTED">Pending</SelectItem>
                    <SelectItem value="APPROVED">Verified</SelectItem>
                    <SelectItem value="REJECTED">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Branch</Label>
                <Select 
                  value={isBranchManager ? user?.branchId : branchId} 
                  onValueChange={setBranchId}
                  disabled={isBranchManager}
                >
                  <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <SelectValue>
                        {isBranchManager
                          ? (branches.find((b: any) => b.id === user?.branchId)?.name || "Select Branch")
                          : branchId && branchId !== "ALL"
                            ? (branches.find((b: any) => b.id === branchId)?.name || "Select Branch")
                            : "All Branches"}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Branches</SelectItem>
                    {branches.map((b: any) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(startDate || endDate || status !== "ALL" || (!isBranchManager && branchId !== "ALL")) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStartDate("");
                    setEndDate("");
                    setStatus("ALL");
                    if (!isBranchManager) setBranchId("ALL");
                    setPage(1);
                  }}
                  className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </SearchFilterPanel>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">
                    Date & ID
                  </TableHead>
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
                    <TableCell colSpan={12} className="h-32 text-center text-muted-foreground font-medium italic">
                      Loading collections...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={12} className="h-32 text-center text-muted-foreground font-medium italic">
                      No collections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((col: any) => {
                    const expected = Number(col.expected || 0);
                    const arrears = Number(col.arrears || 0);
                    const collected = Number(col.amountCollected || 0);
                    const totalDue = expected + arrears;
                    
                    return (
                      <TableRow
                        key={col.id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-bold whitespace-nowrap">{col.date ? format(new Date(col.date), "dd MMM yyyy") : "N/A"}</span>
                            <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest" title={col.id}>
                              ID: {col.id.substring(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
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
                            
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
