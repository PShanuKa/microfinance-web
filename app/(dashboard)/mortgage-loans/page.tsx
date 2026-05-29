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
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";

export default function MortgageLoansPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Mortgage loans list query

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
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            New Mortgage Loan
          </Button>
        </RoleGate>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search by ID, Client Name, Client No..."
          >
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
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
          </SearchFilterPanel>

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
                              onClick={() => router.push(`/mortgage-loans/${loan.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Full Details
                            </DropdownMenuItem>
                            {(loan.status === "DRAFT" || loan.status === "PENDING") && (
                              <DropdownMenuItem
                                onClick={() => router.push(`/mortgage-loans/${loan.id}/edit`)}
                                className="gap-2 cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-amber-500" />
                                Edit Mortgage
                              </DropdownMenuItem>
                            )}
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

