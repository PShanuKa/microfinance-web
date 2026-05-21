"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Printer,
  User,
  Building,
  TrendingUp,
  XCircle,
  Wallet,
  Phone,
  ShieldCheck,
  MapPin,
  Download,
  ShieldAlert,
  Percent,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Car,
  Gem,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useMortgageLoanQuery,
  useApproveMortgageLoanMutation,
  useRejectMortgageLoanMutation,
  useSendMortgageLoanForApprovalMutation,
} from "@/services/mortgageLoanApi";
import { RoleGate } from "@/components/Custom/RoleGate";

export default function MortgageLoanViewPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading: isLoanLoading } = useMortgageLoanQuery(id as string);

  const approveMutation = useApproveMortgageLoanMutation();
  const rejectMutation = useRejectMortgageLoanMutation();
  const sendForApprovalMutation = useSendMortgageLoanForApprovalMutation();

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loanDetails = data?.mortgage;

  const handleSendForApproval = () => {
    sendForApprovalMutation.mutate(
      id as string,
      {
        onSuccess: () => {
          setSuccessMessage(
            "Mortgage application sent for approval successfully!",
          );
          setIsSuccessOpen(true);
        },
      },
    );
  };

  const handleApproveConfirm = () => {
    setIsApproveOpen(false);
    approveMutation.mutate(
      id as string,
      {
        onSuccess: () => {
          setSuccessMessage(
            "Mortgage application approved successfully!",
          );
          setIsSuccessOpen(true);
        },
      },
    );
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) return;
    setIsRejectOpen(false);
    rejectMutation.mutate(
      { id: id as string, rejectionReason },
      {
        onSuccess: () => {
          setSuccessMessage("Mortgage application has been successfully rejected to Draft status.");
          setIsSuccessOpen(true);
          setRejectionReason("");
        },
      },
    );
  };

  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "Rs. 0";
    return `Rs. ${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return "-";
    }
  };

  const getStatusBadge = (status: string) => {
    const baseStyle =
      "px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-2 transition-all";
    switch (status) {
      case "APPROVED":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/10",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm shadow-amber-500/10",
            )}
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm shadow-blue-500/10",
            )}
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge
            variant="outline"
            className={cn(
              baseStyle,
              "bg-slate-100 text-slate-500 border-slate-200",
            )}
          >
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

  if (isLoanLoading) {
    return (
      <div className="p-10 text-center font-medium animate-pulse">
        Loading mortgage loan details...
      </div>
    );
  }

  if (!loanDetails) {
    return (
      <div className="p-10 text-center font-medium">
        Mortgage loan not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/mortgage-loans")}
            className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                {loanDetails.loanNo}
              </h1>
              {getStatusBadge(loanDetails.status)}
            </div>
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" /> {loanDetails.client?.fullname}
              <span className="opacity-40">|</span>
              <Building className="w-4 h-4 text-slate-500" /> {loanDetails.branch?.name || "Main"} Branch
            </p>
          </div>
        </div>

        {/* Approval / Rejection & Edit Actions */}
        <div className="flex gap-2">
          
          <RoleGate allowedRoles={["APPROVER", "BRANCH_MANAGER", "ADMIN"]}>
            {loanDetails.status === "PENDING" && (
              <>
                <Button
                  onClick={() => setIsApproveOpen(true)}
                  variant="default"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 h-11 px-6 font-bold text-white transition-all"
                  disabled={approveMutation.isPending}
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve Mortgage
                </Button>
                <Button
                  onClick={() => setIsRejectOpen(true)}
                  variant="destructive"
                  className="gap-2 shadow-lg shadow-rose-600/20 h-11 px-6 font-bold text-white transition-all"
                  disabled={rejectMutation.isPending}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {loanDetails.status === "DRAFT" && (
              <Button
                onClick={handleSendForApproval}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 h-11 px-6 font-bold text-white transition-all"
                disabled={sendForApprovalMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4" /> Send for Approval
              </Button>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {(loanDetails.status === "DRAFT" || loanDetails.status === "PENDING") && (
              <Button
                variant="outline"
                className="gap-2 h-11 px-6 font-bold text-slate-800 hover:bg-slate-100 transition-all border-slate-200"
                onClick={() => router.push(`/mortgage-loans/${id}/edit`)}
              >
                <FileText className="h-4 w-4 text-amber-500" /> Edit Mortgage
              </Button>
            )}
          </RoleGate>
          
          <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-slate-200">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* Rejection alert banner */}
      {loanDetails.status === "DRAFT" && loanDetails.rejectionReason && (
        <Card className="border-none shadow-xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md overflow-hidden">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-600 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="text-sm font-black uppercase tracking-wider text-rose-800">
                Mortgage Application Rejected to Draft
              </h4>
              <p className="text-sm font-semibold text-rose-700 leading-relaxed">
                {loanDetails.rejectionReason}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md border-l-4 border-l-primary">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-primary" /> Principal Lent
            </span>
            <span className="text-2xl font-black text-slate-800">
              {formatCurrency(loanDetails.lentAmount)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-amber-500" /> Upfront Interest ({Number(loanDetails.interestRate)}%)
            </span>
            <span className="text-2xl font-black text-amber-600">
              {formatCurrency(loanDetails.upfrontInterest)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Net Disbursed
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {formatCurrency(loanDetails.netCashDisbursed)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5 text-indigo-500" /> Monthly Due
            </span>
            <span className="text-2xl font-black text-indigo-600">
              {formatCurrency(loanDetails.monthlyDueAmount)}
            </span>
          </CardContent>
        </Card>

      </div>

      {/* Grid details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Client & Registration */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-primary/20">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <User className="w-5 h-5 text-primary" /> Client &amp; Registration
            </CardTitle>
            <CardDescription className="font-medium text-xs">Primary identification details mapped to this mortgage contract</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Client Name</span>
                <span className="font-bold text-slate-800">{loanDetails.client?.fullname}</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Client No</span>
                <span className="font-mono font-bold text-slate-800">{loanDetails.client?.clientNo}</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">NIC Number</span>
                <span className="font-semibold text-slate-800">{loanDetails.client?.nic}</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {loanDetails.client?.phone}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Branch Office</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" /> {loanDetails.branch?.name || "Main Branch"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Officer In Charge</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {loanDetails.createdBy?.fullname}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Asset Details & Valuation */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-primary/20">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Building className="w-5 h-5 text-primary" /> Asset &amp; Risk Valuation
            </CardTitle>
            <CardDescription className="font-medium text-xs">Collateral asset identification and calculated safety parameters</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Asset Type</span>
                <span className="font-bold">{getAssetBadge(loanDetails.assetType)}</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Market Value</span>
                <span className="font-bold text-slate-800">{formatCurrency(loanDetails.estimatedMarketValue)}</span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Assessed Value</span>
                <span className="font-bold text-slate-800">{formatCurrency(loanDetails.assessedValue)}</span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan-To-Value (LTV)</span>
                  <span className={cn("font-black text-xs px-2 py-0.5 rounded border", getLTVColor(loanDetails.ltvRatio))}>
                    {loanDetails.ltvRatio}%
                  </span>
                </div>
                {/* LTV Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-500", getLTVProgressBarColor(loanDetails.ltvRatio))}
                    style={{ width: `${Math.min(100, loanDetails.ltvRatio)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Asset Description Detail Banner */}
      {loanDetails.assetDescription && (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardContent className="p-6 flex flex-col gap-2.5 text-left">
            <span className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-1.5 border-b pb-2">
              <Info className="h-4 w-4 text-primary" /> Asset Details Description
            </span>
            <p className="text-sm font-semibold text-slate-700 italic leading-relaxed pt-1">
              {loanDetails.assetDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Full Financial Breakdown Table */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
            <Wallet className="w-5 h-5 text-primary" /> Contract Calculations Breakdown
          </CardTitle>
          <CardDescription className="font-medium text-xs">Review calculations and penalty conditions set for this agreement</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-muted/10 border border-muted p-5 rounded-xl text-left">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Upfront Interest Fee ({Number(loanDetails.interestRate)}%)</span>
              <span className="font-bold text-slate-800">{formatCurrency(loanDetails.upfrontInterest)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Monthly Interest Payment</span>
              <span className="font-bold text-indigo-600">{formatCurrency(loanDetails.monthlyDueAmount)}</span>
            </div>
            <div className="flex justify-between border-b pb-2 md:border-0 md:pb-0">
              <span className="text-muted-foreground">Net Payout Released</span>
              <span className="font-bold text-emerald-600">{formatCurrency(loanDetails.netCashDisbursed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Late Penalty (1% of monthly)</span>
              <span className="font-bold text-rose-500">{formatCurrency(loanDetails.dailyPenaltyAmount)} / day</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Collateral Files */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-4 h-4 text-primary" /> Collateral Documents ({loanDetails.collateralFiles?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loanDetails.collateralFiles && loanDetails.collateralFiles.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {loanDetails.collateralFiles.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border border-muted bg-background/50 rounded-xl p-3.5 hover:bg-primary/5 transition-all text-xs text-left"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-black text-slate-800 truncate max-w-[200px]" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                    {file.attachment?.fileUrl && (
                      <a
                        href={file.attachment.fileUrl}
                        download={file.name}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic border border-dashed border-muted/30 rounded-xl p-4 bg-muted/5 text-center">
                No uploaded collateral files
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supplementary Files */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-4 h-4 text-primary" /> Supplementary Verification Files ({loanDetails.titledFiles?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loanDetails.titledFiles && loanDetails.titledFiles.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {loanDetails.titledFiles.map((file: any) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between border border-muted bg-background/50 rounded-xl p-3.5 hover:bg-primary/5 transition-all text-xs text-left"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 text-amber-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-black text-[9px] uppercase text-primary tracking-wide text-left">{file.title}</span>
                        <span className="font-black text-slate-800 truncate max-w-[200px] text-left" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </div>
                    {file.attachment?.fileUrl && (
                      <a
                        href={file.attachment.fileUrl}
                        download={file.name}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground italic border border-dashed border-muted/30 rounded-xl p-4 bg-muted/5 text-center">
                No supplementary verification files
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Mortgage Instalments / Payment Schedule */}
      {loanDetails.instalments && loanDetails.instalments.length > 0 ? (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5 text-primary" /> Repayment Schedule (Instalments)
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Track the monthly interest and principal repayment instalments for this agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border rounded-xl overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-bold text-foreground w-[100px]">
                      Month
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Instalment Date
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Due Date
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-right">
                      Due Amount
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-right">
                      Paid Amount
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-right">
                      Remaining Due
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Paid Date
                    </TableHead>
                    <TableHead className="text-center font-bold text-foreground w-[120px]">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanDetails.instalments.map((inst: any) => (
                    <TableRow
                      key={inst.id}
                      className={cn(
                        "hover:bg-amber-500/5 transition-colors border-b last:border-0",
                        inst.status === "PAID" ? "bg-emerald-500/[0.02]" : "",
                      )}
                    >
                      <TableCell className="text-sm font-bold text-slate-700">
                        Month {String(inst.monthNumber).padStart(2, "0")}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-600">
                        {formatDate(inst.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-600">
                        {formatDate(inst.dueDate)}
                      </TableCell>
                      <TableCell className="text-sm font-bold text-slate-800 text-right">
                        {formatCurrency(inst.dueAmount)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-emerald-600 text-right">
                        {formatCurrency(inst.paidAmount)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-sm font-semibold text-right",
                        Number(inst.remainingDue) > 0 ? "text-rose-600 font-bold" : "text-slate-500"
                      )}>
                        {formatCurrency(inst.remainingDue)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-600">
                        {inst.paidAt ? formatDate(inst.paidAt) : "-"}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Badge
                          className={cn(
                            "font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-wider border-none",
                            inst.status === "PAID"
                              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                              : inst.status === "PARTIAL"
                                ? "bg-amber-500 text-white shadow-sm shadow-amber-500/25"
                                : inst.status === "OVERDUE"
                                  ? "bg-rose-500 text-white animate-pulse shadow-sm shadow-rose-500/25"
                                  : "bg-slate-200 text-slate-500",
                          )}
                        >
                          {inst.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5 text-primary" /> Repayment Schedule (Instalments)
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Track the monthly interest and principal repayment instalments for this agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">No Instalments Generated</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                The repayment schedule and first month upfront interest payment will be automatically generated once this mortgage loan is approved by an authorized manager.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation & Rejection Modals */}
      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogContent className="bg-card border max-w-md p-6 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-800">Approve Mortgage Loan Application</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-semibold text-slate-600">
              Are you sure you want to approve this mortgage agreement? This will transition the status to <strong className="text-emerald-600">APPROVED</strong>, authorizing financial release.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 justify-end mt-4">
            <AlertDialogCancel className="font-bold uppercase tracking-wider text-[10px] border h-10 px-4 rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="font-bold uppercase tracking-wider text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-4 rounded-lg"
            >
              Approve Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-card border max-w-md p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">Reject Mortgage Loan Application</DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-600">
              Please enter the reason for rejecting this application. This updates the status back to <strong>DRAFT</strong> so the officer can modify and resubmit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Provide clear reasons for rejection (e.g. incorrect assessed value, missing guarantor ID documents, high LTV)..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] bg-background border-input focus:ring-rose-500/20 text-slate-800 font-semibold"
            />
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              className="font-bold uppercase tracking-wider text-[10px] border h-10 px-4 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
              className="font-bold uppercase tracking-wider text-[10px] bg-rose-600 hover:bg-rose-700 text-white h-10 px-4 rounded-lg"
            >
              Reject Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Notification Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="bg-card border max-w-sm p-6 shadow-2xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <DialogTitle className="text-lg font-black text-slate-800">Action Complete</DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-600 mt-1">
              {successMessage}
            </DialogDescription>
          </div>
          <DialogFooter className="w-full">
            <Button
              onClick={() => {
                setIsSuccessOpen(false);
                router.refresh();
              }}
              className="w-full font-bold uppercase tracking-wider text-[10px] bg-slate-900 hover:bg-slate-800 text-white h-11 rounded-lg"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
