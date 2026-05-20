"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetMeQuery } from "@/services/authApi";
import { useBranchesQuery } from "@/services/branchApi";
import { useMortgageLoansQuery, useMortgageLoanQuery } from "@/services/mortgageLoanApi";
import { PageHeader } from "@/components/Custom/PageHeader";
import { RoleGate } from "@/components/Custom/RoleGate";
import TablePagination from "@/components/Custom/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MoreVertical,
  Car,
  Gem,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Percent,
  Download,
  Info,
  DollarSign,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MortgageLoansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openItem, setOpenItem] = useState<string[]>([]);
  const [selectedMortgageId, setSelectedMortgageId] = useState<string | null>(null);

  // Get current user profile for role and branch restriction
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.user;

  // Get branches list
  const { data: branchesData } = useBranchesQuery();
  const branches = branchesData?.branches || [];

  // URL synced filters
  const statusFilter = searchParams.get("status") || "All";
  const branchFilter = searchParams.get("branchId") || "All";

  // Check if branch select filter should be locked/disabled
  const isBranchSelectDisabled =
    currentUser?.role !== "ADMIN" && currentUser?.role !== "AUDITOR" && !!currentUser?.branchId;
  const effectiveBranchFilter = isBranchSelectDisabled
    ? currentUser.branchId
    : branchFilter;

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

  const { data, isLoading } = useMortgageLoansQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: statusFilter === "All" ? undefined : statusFilter,
    branchId: effectiveBranchFilter === "All" ? undefined : effectiveBranchFilter,
  });

  // Query for mortgage detail
  const { data: detailData, isLoading: isDetailLoading } = useMortgageLoanQuery(
    selectedMortgageId || "",
    { enabled: !!selectedMortgageId }
  );
  const loanDetails = detailData?.mortgage;

  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "Rs. 0";
    return `Rs. ${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  };

  const getStatusBadge = (status: string) => {
    const baseStyle =
      "border-none px-3 py-1 rounded-full font-bold text-white flex items-center gap-1 w-fit text-xs";
    switch (status) {
      case "APPROVED":
        return (
          <Badge className={cn(baseStyle, "bg-emerald-500 hover:bg-emerald-600")}>
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
      case "COMPLETED":
        return (
          <Badge className={cn(baseStyle, "bg-blue-500 hover:bg-blue-600")}>
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 px-3 py-1 rounded-full font-bold">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAssetBadge = (type: string) => {
    const baseStyle = "border-none px-2 py-0.5 rounded-md font-bold text-xs flex items-center gap-1 w-fit";
    switch (type) {
      case "VEHICLE":
        return (
          <Badge className={cn(baseStyle, "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20")}>
            <Car className="h-3 w-3" />
            Vehicle
          </Badge>
        );
      case "PROPERTY":
        return (
          <Badge className={cn(baseStyle, "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20")}>
            <Building className="h-3 w-3" />
            Property
          </Badge>
        );
      case "GOLD":
        return (
          <Badge className={cn(baseStyle, "bg-amber-500/10 text-amber-400 border border-amber-500/20")}>
            <Gem className="h-3 w-3" />
            Gold
          </Badge>
        );
      case "OTHER":
      default:
        return (
          <Badge className={cn(baseStyle, "bg-slate-500/10 text-slate-400 border border-slate-500/20")}>
            <FileText className="h-3 w-3" />
            Other
          </Badge>
        );
    }
  };

  const getLTVColor = (ltv: number) => {
    if (ltv <= 50) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (ltv <= 75) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const getLTVProgressBarColor = (ltv: number) => {
    if (ltv <= 50) return "bg-emerald-500";
    if (ltv <= 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4 pb-10">
      <PageHeader
        title="Mortgage Loans"
        description="Monitor and manage asset-secured mortgage contracts, collateral documents, and risk valuation"
      >
        <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
          <Button
            onClick={() => router.push("/mortgage-loans/Create")}
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 h-10 px-5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            New Mortgage Loan
          </Button>
        </RoleGate>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row items-center p-4 border-b bg-muted/20 gap-4 justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Client Name, Client No..."
                className="pl-10 h-10 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setOpenItem((prev) =>
                  prev.includes("item-1") ? [] : ["item-1"]
                )
              }
              className="gap-2 border-primary/20 hover:bg-primary/5 h-10 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all w-full md:w-auto"
            >
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          {/* Filtering Accordion */}
          <Accordion
            value={openItem}
            onValueChange={setOpenItem}
            className="w-full border-none"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionContent className="px-4 py-4 border-b bg-muted/20">
                <div className="flex flex-col md:flex-row items-end gap-4">
                  {/* Status Filter */}
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
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Branch Filter */}
                  <div className="flex flex-col gap-1.5 w-full md:w-auto">
                    <Label className="text-xs text-muted-foreground ml-1">Branch</Label>
                    <Select
                      value={effectiveBranchFilter}
                      onValueChange={(val) => updateFilters({ branchId: val || "All" })}
                      disabled={isBranchSelectDisabled}
                    >
                      <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <SelectValue>
                            {effectiveBranchFilter && effectiveBranchFilter !== "All"
                              ? (branches.find((b: any) => b.id === effectiveBranchFilter)?.name || "Select branch")
                              : "All Branches"}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Branches</SelectItem>
                        {branches.map((b: any) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Button */}
                  {(statusFilter !== "All" || (!isBranchSelectDisabled && branchFilter !== "All")) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        updateFilters({
                          status: "All",
                          branchId: isBranchSelectDisabled ? currentUser?.branchId : "All",
                        })
                      }
                      className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[120px] font-bold text-foreground">
                    Loan ID
                  </TableHead>
                  <TableHead className="w-[200px] font-bold text-foreground">
                    Client & Branch
                  </TableHead>
                  <TableHead className="w-[180px] font-bold text-foreground">
                    Collateral Asset
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Valuation (Est/Ass)
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Lent Amount (LTV)
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Monthly Due
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner className="h-6 w-6 text-primary" />
                        <span className="text-muted-foreground font-medium">Loading mortgage loans...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.mortgages?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                        <AlertTriangle className="h-6 w-6 text-amber-500/80" />
                        <p className="font-bold">No mortgage loans found</p>
                        <p className="text-xs">Try broadening your search criteria or add a new record.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.mortgages?.map((loan: any) => (
                    <TableRow
                      key={loan.id}
                      className="hover:bg-primary/5 transition-all group"
                    >
                      {/* Loan ID */}
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

                      {/* Client & Branch */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {loan.client?.fullname}
                          </span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" />
                            {loan.branch?.name || "Main Branch"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Collateral Asset */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getAssetBadge(loan.assetType)}
                          {loan.assetDescription && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">
                              {loan.assetDescription}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Valuation */}
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-foreground text-sm">
                            {formatCurrency(loan.estimatedMarketValue)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Assessed: {formatCurrency(loan.assessedValue)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Lent & LTV */}
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-foreground text-sm">
                            {formatCurrency(loan.lentAmount)}
                          </span>
                          <Badge
                            className={cn(
                              "border px-1.5 py-0 rounded text-[10px] font-black tracking-wide",
                              getLTVColor(loan.ltvRatio)
                            )}
                          >
                            LTV: {loan.ltvRatio}%
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Monthly Due */}
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-500">
                            {formatCurrency(loan.monthlyDueAmount)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Rate: {Number(loan.interestRate)}% / month
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {getStatusBadge(loan.status)}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="rounded-full opacity-60 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4 text-foreground" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 bg-card/95 backdrop-blur-md border border-muted"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Mortgage Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedMortgageId(loan.id)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Full Details
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

      {/* Detailed Modal Viewer */}
      <Dialog open={!!selectedMortgageId} onOpenChange={(open) => { if (!open) setSelectedMortgageId(null); }}>
        <DialogContent className="sm:max-w-2xl bg-card border border-muted p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {isDetailLoading ? (
            <div className="flex flex-col items-center justify-center p-16 gap-3">
              <Spinner className="h-8 w-8 text-primary" />
              <p className="text-muted-foreground font-semibold">Fetching complete contract details...</p>
            </div>
          ) : loanDetails ? (
            <div className="flex flex-col">
              {/* Modal Header banner */}
              <div className="bg-muted/40 p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {loanDetails.assetType === "VEHICLE" && <Car className="h-6 w-6 text-indigo-400" />}
                    {loanDetails.assetType === "PROPERTY" && <Building className="h-6 w-6 text-cyan-400" />}
                    {loanDetails.assetType === "GOLD" && <Gem className="h-6 w-6 text-amber-400" />}
                    {loanDetails.assetType === "OTHER" && <FileText className="h-6 w-6 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground leading-none">{loanDetails.loanNo}</h3>
                      {getStatusBadge(loanDetails.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on {new Date(loanDetails.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                
                {/* 3-Column Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-muted bg-muted/10">
                    <CardContent className="p-4 flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-primary" /> Lent Capital
                      </span>
                      <span className="text-lg font-black text-foreground">{formatCurrency(loanDetails.lentAmount)}</span>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted bg-muted/10">
                    <CardContent className="p-4 flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500" /> Net Disbursed
                      </span>
                      <span className="text-lg font-black text-emerald-500">{formatCurrency(loanDetails.netCashDisbursed)}</span>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted bg-muted/10">
                    <CardContent className="p-4 flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <Percent className="h-3 w-3 text-indigo-400" /> Interest Rate
                      </span>
                      <span className="text-lg font-black text-indigo-400">{Number(loanDetails.interestRate)}% / Mo</span>
                    </CardContent>
                  </Card>
                </div>

                {/* 2-Column Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Client & Origin */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-primary flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> Client & Registration
                    </h4>
                    
                    <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Client Name</span>
                        <span className="font-bold text-foreground">{loanDetails.client?.fullname}</span>
                      </div>
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Client No</span>
                        <span className="font-mono font-bold text-foreground">{loanDetails.client?.clientNo}</span>
                      </div>
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Phone Number</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" /> {loanDetails.client?.phone}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Branch Office</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Building className="h-3 w-3 text-muted-foreground" /> {loanDetails.branch?.name || "Main Branch"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Officer In Charge</span>
                        <span className="font-medium text-foreground flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-muted-foreground" /> {loanDetails.createdBy?.fullname}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Asset Details & Valuation */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs uppercase tracking-wider font-extrabold text-primary flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" /> Asset & Risk Valuation
                    </h4>

                    <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Asset Type</span>
                        <span className="font-bold">{getAssetBadge(loanDetails.assetType)}</span>
                      </div>
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Market Value</span>
                        <span className="font-bold text-foreground">{formatCurrency(loanDetails.estimatedMarketValue)}</span>
                      </div>
                      <div className="flex justify-between border-b border-muted/30 pb-2">
                        <span className="text-muted-foreground">Assessed Value</span>
                        <span className="font-bold text-foreground">{formatCurrency(loanDetails.assessedValue)}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loan-To-Value (LTV)</span>
                          <span className={cn("font-black text-xs px-2 py-0.5 rounded border", getLTVColor(loanDetails.ltvRatio))}>
                            {loanDetails.ltvRatio}%
                          </span>
                        </div>
                        {/* LTV Bar */}
                        <div className="w-full bg-muted h-2 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-500", getLTVProgressBarColor(loanDetails.ltvRatio))} 
                            style={{ width: `${Math.min(100, loanDetails.ltvRatio)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collateral Description Banner */}
                {loanDetails.assetDescription && (
                  <div className="bg-muted/10 border border-muted p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-primary" /> Asset Details Description
                    </span>
                    <p className="text-sm text-foreground/80 italic leading-relaxed">{loanDetails.assetDescription}</p>
                  </div>
                )}

                {/* Full Financial Calculation Breakdown */}
                <div className="flex flex-col gap-3 bg-muted/10 border border-muted p-4 rounded-xl">
                  <h4 className="text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-muted/30 pb-2">
                    Contract Calculations Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Upfront Interest Fee ({Number(loanDetails.interestRate)}%)</span>
                      <span className="font-bold text-foreground">{formatCurrency(loanDetails.upfrontInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Due Installment</span>
                      <span className="font-bold text-emerald-500">{formatCurrency(loanDetails.monthlyDueAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Cash Disbursed</span>
                      <span className="font-bold text-foreground">{formatCurrency(loanDetails.netCashDisbursed)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Late Penalty (1% of monthly)</span>
                      <span className="font-bold text-rose-500">{formatCurrency(loanDetails.dailyPenaltyAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Document Files Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Collateral Files */}
                  <div className="flex flex-col gap-2.5">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Collateral Documents ({loanDetails.collateralFiles?.length || 0})
                    </h5>
                    {loanDetails.collateralFiles && loanDetails.collateralFiles.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {loanDetails.collateralFiles.map((file: any) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between border border-muted/30 bg-muted/5 rounded-lg p-2.5 hover:bg-muted/15 transition-all text-xs"
                          >
                            <span className="font-semibold text-foreground truncate max-w-[180px]" title={file.name}>
                              {file.name}
                            </span>
                            {file.attachment?.fileUrl && (
                              <a
                                href={file.attachment.fileUrl}
                                download={file.name}
                                target="_blank"
                                rel="noreferrer"
                                className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center text-primary"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic border border-dashed border-muted/30 rounded-lg p-3 bg-muted/5 text-center">
                        No uploaded collateral files
                      </div>
                    )}
                  </div>

                  {/* Titled Supplementary Files */}
                  <div className="flex flex-col gap-2.5">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      Supplementary Verification Files ({loanDetails.titledFiles?.length || 0})
                    </h5>
                    {loanDetails.titledFiles && loanDetails.titledFiles.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {loanDetails.titledFiles.map((file: any) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between border border-muted/30 bg-muted/5 rounded-lg p-2.5 hover:bg-muted/15 transition-all text-xs"
                          >
                            <div className="flex flex-col gap-0.5 truncate max-w-[180px]">
                              <span className="font-black text-[9px] uppercase text-primary tracking-wide">{file.title}</span>
                              <span className="font-semibold text-foreground truncate" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                            {file.attachment?.fileUrl && (
                              <a
                                href={file.attachment.fileUrl}
                                download={file.name}
                                target="_blank"
                                rel="noreferrer"
                                className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center text-primary"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic border border-dashed border-muted/30 rounded-lg p-3 bg-muted/5 text-center">
                        No supplementary verification files
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Modal Footer */}
              <DialogFooter className="border-t bg-muted/40 p-4 flex justify-end">
                <Button
                  onClick={() => setSelectedMortgageId(null)}
                  className="font-bold border border-muted px-6 h-10 rounded-lg bg-background hover:bg-muted transition-all text-xs uppercase tracking-wider"
                >
                  Close Details
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

