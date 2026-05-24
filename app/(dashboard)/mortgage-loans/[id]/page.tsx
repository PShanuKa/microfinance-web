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
  Plus,
  Receipt,
  MoreVertical,
  CheckIcon,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useRecordMortgagePaymentMutation,
  useMortgageCollectionQuery,
} from "@/services/mortgageLoanApi";
import { RoleGate } from "@/components/Custom/RoleGate";
import { CommonButton }  from "@/components/common/Button";
import { useDialogStore } from "@/store/useDialogStore";
import api from "@/lib/axios";

export default function MortgageLoanViewPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading: isLoanLoading } = useMortgageLoanQuery(id as string);

  const approveMutation = useApproveMortgageLoanMutation();
  const rejectMutation = useRejectMortgageLoanMutation();
  const sendForApprovalMutation = useSendMortgageLoanForApprovalMutation();
  const recordPaymentMutation = useRecordMortgagePaymentMutation();

  const { setOpen } = useDialogStore();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const { data: detailsData, isLoading: detailsLoading } =
    useMortgageCollectionQuery(selectedCollectionId || "", {
      enabled: !!selectedCollectionId,
    });
  const selectedCollection = detailsData?.collection;

  const loanDetails = data?.mortgage;

  const handleSendForApproval = () => {
    sendForApprovalMutation.mutate(id as string, {
      onSuccess: () => {
        setOpen({
          open: true,
          type: "success",
          title: "Action Complete",
          message: "Mortgage application sent for approval successfully!",
          onConfirm: () => router.refresh()
        });
      },
    });
  };

  const handlePrintVoucher = async () => {
    try {
      const response = await api.get(`/mortgage-loans/${id}/voucher`);
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(response.data);
        printWindow.document.close();
      }
    } catch (error) {
      console.error("Failed to generate voucher:", error);
    }
  };

  const openApproveDialog = () => {
    setOpen({
      open: true,
      type: "approve",
      title: "Approve Mortgage Loan Application",
      message: "Are you sure you want to approve this mortgage agreement? This will transition the status to APPROVED, authorizing financial release.",
      onConfirm: () => {
        approveMutation.mutate(id as string, {
          onSuccess: () => {
            setOpen({
              open: true,
              type: "success",
              title: "Action Complete",
              message: "Mortgage application approved successfully!",
              onConfirm: () => router.refresh()
            });
          },
        });
      }
    });
  };

  const openRejectDialog = () => {
    setOpen({
      open: true,
      type: "confirmation",
      title: "Reject Mortgage Loan Application",
      message: "Please enter the reason for rejecting this application. This updates the status back to DRAFT so the officer can modify and resubmit.",
      onConfirm: (reason) => {
        if (!reason?.trim()) return;
        rejectMutation.mutate(
          { id: id as string, rejectionReason: reason },
          {
            onSuccess: () => {
              setOpen({
                open: true,
                type: "success",
                title: "Action Complete",
                message: "Mortgage application has been successfully rejected to Draft status.",
                onConfirm: () => router.refresh()
              });
            },
          },
        );
      }
    });
  };

  const handlePaymentConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    recordPaymentMutation.mutate(
      {
        id: id as string,
        amount: amountNum,
        notes: paymentNotes || undefined,
      },
      {
        onSuccess: (res) => {
          setIsPaymentOpen(false);
          setPaymentAmount("");
          setPaymentNotes("");
          setOpen({
            open: true,
            type: "success",
            title: "Action Complete",
            message: `Payment of ${formatCurrency(amountNum)} successfully recorded! Excess principal reduction: ${formatCurrency(res.principalReduction || 0)}.`,
            onConfirm: () => router.refresh()
          });
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
    const baseStyle =
      "border-none px-2 py-0.5 rounded-md font-bold text-xs flex items-center gap-1 w-fit";
    switch (type) {
      case "VEHICLE":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
            )}
          >
            <Car className="h-3 w-3" />
            Vehicle
          </Badge>
        );
      case "PROPERTY":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
            )}
          >
            <Building className="h-3 w-3" />
            Property
          </Badge>
        );
      case "GOLD":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-amber-500/10 text-amber-400 border border-amber-500/20",
            )}
          >
            <Gem className="h-3 w-3" />
            Gold
          </Badge>
        );
      case "OTHER":
      default:
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-slate-500/10 text-slate-400 border border-slate-500/20",
            )}
          >
            <FileText className="h-3 w-3" />
            Other
          </Badge>
        );
    }
  };

  const getLTVColor = (ltv: number) => {
    if (ltv <= 50)
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
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

  // Calculate values for Payment Summary Cards
  const instalments = loanDetails?.instalments || [];
  const totalRemainingDue = instalments.reduce(
    (sum: number, inst: any) => sum + Number(inst.remainingDue || 0),
    0,
  );
  const totalPaidDues = instalments.reduce(
    (sum: number, inst: any) => sum + Number(inst.paidAmount || 0),
    0,
  );

  // Calculate outstanding penalty: for each instalment, penaltyAmount minus sum(penaltyPaid in collectionItems)
  const totalOutstandingPenalty = instalments.reduce(
    (sum: number, inst: any) => {
      const penaltyPaid = (inst.collectionItems || []).reduce(
        (subSum: number, item: any) => subSum + Number(item.penaltyPaid || 0),
        0,
      );
      return sum + Math.max(0, Number(inst.penaltyAmount || 0) - penaltyPaid);
    },
    0,
  );

  const principalPaid = Number(loanDetails?.principalPaid || 0);

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      {/* <div className="flex gap-5">
        <CommonButton variant="success">Save Changes</CommonButton>
        <CommonButton variant="error">Delete Account</CommonButton>
        <CommonButton variant="warning">Archive Item</CommonButton>
        <CommonButton variant="info">Learn More</CommonButton>
        <CommonButton variant="success" isLoading>
          Saving...
        </CommonButton>
        <CommonButton variant="success" leftIcon={<CheckIcon />}>
          Confirm
        </CommonButton>
          <CommonButton variant="error" size="sm">
            Remove
          </CommonButton>
          <CommonButton variant="success" size="lg">
            Submit
          </CommonButton>
           <CommonButton variant="outline" leftIcon={<CheckIcon />} size="lg">
            Submit
          </CommonButton>
      </div> */}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CommonButton
            variant="ghost"
            size="icon"
            onClick={() => router.push("/mortgage-loans")}
            className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border"
          >
            <ArrowLeft className="h-5 w-5" />
          </CommonButton>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                {loanDetails.loanNo}
              </h1>
              {getStatusBadge(loanDetails.status)}
            </div>
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />{" "}
              {loanDetails.client?.fullname}
              <span className="opacity-40">|</span>
              <Building className="w-4 h-4 text-slate-500" />{" "}
              {loanDetails.branch?.name || "Main"} Branch
            </p>
          </div>
        </div>

        {/* Approval / Rejection & Edit Actions */}
        <div className="flex gap-2">
          <RoleGate allowedRoles={["APPROVER", "BRANCH_MANAGER", "ADMIN"]}>
            {loanDetails.status === "PENDING" && (
              <>
                <CommonButton
                  onClick={openApproveDialog}
                  variant="success"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  isLoading={approveMutation.isPending}
                 
                >
                  Approve Mortgage
                </CommonButton>
                <CommonButton
                  onClick={openRejectDialog}
                  variant="error"
                  leftIcon={<XCircle className="h-4 w-4" />}
                  isLoading={rejectMutation.isPending}
               
                >
                  Reject
                </CommonButton>
              </>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {loanDetails.status === "DRAFT" && (
              <CommonButton
                onClick={handleSendForApproval}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 h-11 px-6 font-bold text-white transition-all"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                isLoading={sendForApprovalMutation.isPending}
              >
                Send for Approval
              </CommonButton>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {(loanDetails.status === "DRAFT" ||
              loanDetails.status === "PENDING") && (
              // <Button
              //   variant="outline"
              //   className="gap-2 h-11 px-6 font-bold text-slate-800 hover:bg-slate-100 transition-all border-slate-200"
              //   onClick={() => router.push(`/mortgage-loans/${id}/edit`)}
              // >
              //   <FileText className="h-4 w-4 text-amber-500" /> Edit Mortgage
              // </Button>
              <CommonButton variant="outline" leftIcon={<FileText className="h-4 w-4 text-amber-500" />}>
             Edit Mortgage
            </CommonButton>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {(loanDetails.status === "APPROVED" ||
              loanDetails.status === "COMPLETED") && (
              <CommonButton
                onClick={() =>
                  router.push(
                    `/mortgage-collection/create?loanId=${loanDetails.id}`,
                  )
                }
                variant="success"
                leftIcon={<Plus className="h-4 w-4" />}
                // className="shadow-lg shadow-emerald-600/20 h-11 px-6 font-bold transition-all"
              >
                New Collection
              </CommonButton>
            )}
          </RoleGate>
          <CommonButton
            variant="outline"
            leftIcon={<Printer className="h-4 w-4" />}
            onClick={handlePrintVoucher}
          >
            Print Payment Voucher
          </CommonButton>

          <CommonButton
            variant="outline"
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print
          </CommonButton>
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
            {Number(loanDetails.principalPaid) > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 w-fit px-1.5 py-0.5 rounded border border-emerald-500/20 mt-1">
                - {formatCurrency(loanDetails.principalPaid)} Settled
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-amber-500" /> Upfront
              Interest ({Number(loanDetails.interestRate)}%)
            </span>
            <span className="text-2xl font-black text-amber-600">
              {formatCurrency(loanDetails.upfrontInterest)}
            </span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Net
              Disbursed
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
              <User className="w-5 h-5 text-primary" /> Client &amp;
              Registration
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Primary identification details mapped to this mortgage contract
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Client Name</span>
                <span className="font-bold text-slate-800">
                  {loanDetails.client?.fullname}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Client No</span>
                <span className="font-mono font-bold text-slate-800">
                  {loanDetails.client?.clientNo}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">NIC Number</span>
                <span className="font-semibold text-slate-800">
                  {loanDetails.client?.nic}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                  {loanDetails.client?.phone}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Branch Office</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                  {loanDetails.branch?.name || "Main Branch"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Officer In Charge</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                  {loanDetails.createdBy?.fullname}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Asset Details & Valuation */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-primary/20">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Building className="w-5 h-5 text-primary" /> Asset &amp; Risk
              Valuation
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Collateral asset identification and calculated safety parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-3 text-sm bg-muted/5 border border-muted p-4 rounded-xl">
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Asset Type</span>
                <span className="font-bold">
                  {getAssetBadge(loanDetails.assetType)}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Market Value</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(loanDetails.estimatedMarketValue)}
                </span>
              </div>
              <div className="flex justify-between border-b border-muted/30 pb-2.5">
                <span className="text-muted-foreground">Assessed Value</span>
                <span className="font-bold text-slate-800">
                  {formatCurrency(loanDetails.assessedValue)}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pt-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Loan-To-Value (LTV)
                  </span>
                  <span
                    className={cn(
                      "font-black text-xs px-2 py-0.5 rounded border",
                      getLTVColor(loanDetails.ltvRatio),
                    )}
                  >
                    {loanDetails.ltvRatio}%
                  </span>
                </div>
                {/* LTV Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      getLTVProgressBarColor(loanDetails.ltvRatio),
                    )}
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
              <Info className="h-4 w-4 text-primary" /> Asset Details
              Description
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
            <Wallet className="w-5 h-5 text-primary" /> Contract Calculations
            Breakdown
          </CardTitle>
          <CardDescription className="font-medium text-xs">
            Review calculations and penalty conditions set for this agreement
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-muted/10 border border-muted p-5 rounded-xl text-left">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">
                Upfront Interest Fee ({Number(loanDetails.interestRate)}%)
              </span>
              <span className="font-bold text-slate-800">
                {formatCurrency(loanDetails.upfrontInterest)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">
                Monthly Interest Payment
              </span>
              <span className="font-bold text-indigo-600">
                {formatCurrency(loanDetails.monthlyDueAmount)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 md:border-0 md:pb-0">
              <span className="text-muted-foreground">Net Payout Released</span>
              <span className="font-bold text-emerald-600">
                {formatCurrency(loanDetails.netCashDisbursed)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Daily Late Penalty (1% of monthly)
              </span>
              <span className="font-bold text-rose-500">
                {formatCurrency(loanDetails.dailyPenaltyAmount)} / day
              </span>
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
              <FileText className="w-4 h-4 text-primary" /> Collateral Documents
              ({loanDetails.collateralFiles?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loanDetails.collateralFiles &&
            loanDetails.collateralFiles.length > 0 ? (
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
                      <span
                        className="font-black text-slate-800 truncate max-w-[200px]"
                        title={file.name}
                      >
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
              <FileText className="w-4 h-4 text-primary" /> Supplementary
              Verification Files ({loanDetails.titledFiles?.length || 0})
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
                        <span className="font-black text-[9px] uppercase text-primary tracking-wide text-left">
                          {file.title}
                        </span>
                        <span
                          className="font-black text-slate-800 truncate max-w-[200px] text-left"
                          title={file.name}
                        >
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

      {/* Payment Action & Summary Cards */}
      {(loanDetails.status === "APPROVED" ||
        loanDetails.status === "COMPLETED") && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Action Header with Payment Button */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="text-left">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                Payment Operations
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">
                Perform client collections and track outstanding balances
              </p>
            </div>
            {/* <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
              <Button
                onClick={() => setIsPaymentOpen(true)}
                className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-700 shadow-md shadow-primary/20 text-white font-bold h-11 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] duration-200"
              >
                <Plus className="h-5 w-5" /> Record Payment
              </Button>
            </RoleGate> */}
          </div>

          {/* Premium Payment Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Remaining Dues Card */}
            <Card className="border border-rose-500/10 shadow-lg bg-gradient-to-br from-rose-500/[0.02] to-card overflow-hidden hover:shadow-xl transition-all group duration-300">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-600 transition-transform group-hover:scale-110 duration-300">
                  <Wallet className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Outstanding Dues
                  </span>
                  <span className="text-2xl font-black text-rose-600 tracking-tight mt-1">
                    {formatCurrency(totalRemainingDue)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold mt-0.5">
                    Base dues + outstanding penalty
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Total Paid Dues Card */}
            <Card className="border border-emerald-500/10 shadow-lg bg-gradient-to-br from-emerald-500/[0.02] to-card overflow-hidden hover:shadow-xl transition-all group duration-300">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-600 transition-transform group-hover:scale-110 duration-300">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Paid Dues
                  </span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight mt-1">
                    {formatCurrency(totalPaidDues)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold mt-0.5">
                    Base dues settled so far
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Outstanding Penalty Card */}
            <Card className="border border-amber-500/10 shadow-lg bg-gradient-to-br from-amber-500/[0.02] to-card overflow-hidden hover:shadow-xl transition-all group duration-300">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600 transition-transform group-hover:scale-110 duration-300">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Outstanding Penalty
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-black tracking-tight mt-1",
                      totalOutstandingPenalty > 0
                        ? "text-amber-600"
                        : "text-slate-500",
                    )}
                  >
                    {formatCurrency(totalOutstandingPenalty)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold mt-0.5">
                    Unpaid accumulated penalty
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Principal Paid Card */}
            <Card className="border border-indigo-500/10 shadow-lg bg-gradient-to-br from-indigo-500/[0.02] to-card overflow-hidden hover:shadow-xl transition-all group duration-300">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600 transition-transform group-hover:scale-110 duration-300">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Principal Reduced
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-black tracking-tight mt-1",
                      principalPaid > 0 ? "text-indigo-600" : "text-slate-500",
                    )}
                  >
                    {formatCurrency(principalPaid)}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-bold mt-0.5">
                    Reduction from excess payments
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mortgage Instalments / Payment Schedule */}
      {loanDetails.instalments && loanDetails.instalments.length > 0 ? (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="w-5 h-5 text-primary" /> Repayment Schedule
              (Instalments)
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Track the monthly interest and principal repayment instalments for
              this agreement
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
                      Penalty
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
                        "hover:bg-muted/30 transition-colors border-b last:border-0",
                        inst.status === "PAID" && "bg-emerald-500/[0.02]",
                        inst.status === "OVERDUE" && "bg-rose-500/[0.03]",
                      )}
                    >
                      <TableCell className="text-sm font-bold text-slate-700">
                        Month {String(inst.monthNumber).padStart(2, "00")}
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
                      <TableCell
                        className={cn(
                          "text-sm font-bold text-right",
                          Number(inst.penaltyAmount) > 0
                            ? "text-rose-600"
                            : "text-slate-400",
                        )}
                      >
                        {Number(inst.penaltyAmount) > 0
                          ? formatCurrency(inst.penaltyAmount)
                          : "—"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-sm font-semibold text-right",
                          Number(inst.remainingDue) > 0
                            ? "text-rose-600 font-bold"
                            : "text-slate-500",
                        )}
                      >
                        {formatCurrency(inst.remainingDue)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-slate-600">
                        {inst.paidAt ? formatDate(inst.paidAt) : "—"}
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
              <Calendar className="w-5 h-5 text-primary" /> Repayment Schedule
              (Instalments)
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              Track the monthly interest and principal repayment instalments for
              this agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">
                No Instalments Generated
              </h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                The repayment schedule and first month upfront interest payment
                will be automatically generated once this mortgage loan is
                approved by an authorized manager.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collections History */}
      {loanDetails.collections && loanDetails.collections.length > 0 && (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden mt-6">
          <CardHeader className="bg-muted/10 border-b">
            <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
              <Receipt className="w-5 h-5 text-primary" /> Payment Receipts
              History
            </CardTitle>
            <CardDescription className="font-medium text-xs">
              History of all payments and principal reductions processed for
              this mortgage loan.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border rounded-xl overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="font-bold text-foreground">
                      Date & Time
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-right">
                      Total Paid
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-right">
                      Principal Reduced
                    </TableHead>
                    <TableHead className="font-bold text-foreground text-center">
                      Collected By
                    </TableHead>
                    <TableHead className="text-right font-bold text-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanDetails.collections.map((col: any) => (
                    <TableRow
                      key={col.id}
                      className="hover:bg-primary/5 transition-colors group cursor-pointer border-b last:border-0"
                      onClick={() => setSelectedCollectionId(col.id)}
                    >
                      <TableCell className="font-medium text-slate-600">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {format(new Date(col.createdAt), "dd MMM yyyy")}
                          </span>
                          <span className="text-[10px] uppercase text-muted-foreground">
                            {format(new Date(col.createdAt), "hh:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {formatCurrency(col.amount)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-indigo-500">
                        {Number(col.principalReduction) > 0
                          ? formatCurrency(col.principalReduction)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center font-medium text-sm text-slate-600">
                        {col.collectedBy?.fullname || "System"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                          >
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
                                Collection Actions
                              </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setSelectedCollectionId(col.id)}
                              className="gap-2 cursor-pointer"
                            >
                              <FileText className="h-4 w-4 text-primary" /> View
                              Details Breakdown
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
      )}



      {/* Record Mortgage Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="bg-card border max-w-md p-6 shadow-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" /> Record Mortgage
              Payment
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
              Enter the collected payment amount. Payments are prioritized to
              settle the oldest months first, paying off outstanding penalties
              before base interest dues. Any excess settles the loan principal.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handlePaymentConfirm}
            className="space-y-4 py-4 text-left"
          >
            <div className="space-y-1.5">
              <label
                htmlFor="amount"
                className="text-xs font-black uppercase tracking-wider text-slate-500"
              >
                Payment Amount (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  Rs.
                </span>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-bold text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="notes"
                className="text-xs font-black uppercase tracking-wider text-slate-500"
              >
                Collector Notes / Reference (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="Provide transaction details, e.g. Cash payment at the branch, Bank transfer reference code..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="min-h-[100px] bg-background border-input focus:ring-primary/20 text-slate-800 font-semibold"
              />
            </div>

            <DialogFooter className="flex gap-2 justify-end pt-2">
              <CommonButton
                type="button"
                variant="outline"
                onClick={() => setIsPaymentOpen(false)}
                className="font-bold uppercase tracking-wider text-[10px] border h-11 px-4 rounded-xl"
              >
                Cancel
              </CommonButton>
              <CommonButton
                type="submit"
                disabled={!paymentAmount}
                isLoading={recordPaymentMutation.isPending}
                className="font-bold uppercase tracking-wider text-[10px] h-11 px-5 rounded-xl shadow-md shadow-primary/10 transition-all"
              >
                Settle Payment
              </CommonButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* Collection Details Dialog */}
      <Dialog
        open={!!selectedCollectionId}
        onOpenChange={(open: boolean) => !open && setSelectedCollectionId(null)}
      >
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Receipt Details
            </DialogTitle>
            <DialogDescription>
              Breakdown of how this payment was distributed.
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="p-8 text-center text-muted-foreground animate-pulse">
              Loading breakdown...
            </div>
          ) : selectedCollection ? (
            <div className="mt-6 space-y-6">
              {/* Core summary */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Loan Number
                  </p>
                  <p className="font-black text-primary">
                    {selectedCollection.mortgage?.loanNo}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Date & Time
                  </p>
                  <p className="font-bold">
                    {format(
                      new Date(selectedCollection.createdAt),
                      "dd MMM yyyy, HH:mm",
                    )}
                  </p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Total Paid Amount
                  </p>
                  <p className="text-3xl font-black text-emerald-600">
                    Rs. {Number(selectedCollection.amount).toLocaleString()}
                  </p>
                </div>
                {Number(selectedCollection.principalReduction) > 0 && (
                  <div className="col-span-2 pt-2 border-t bg-indigo-50/50 -mx-4 px-4 pb-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest pt-2">
                      Excess Applied to Principal
                    </p>
                    <p className="text-xl font-black text-indigo-600">
                      Rs.{" "}
                      {Number(
                        selectedCollection.principalReduction,
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <FileText className="h-4 w-4" /> Settlement Breakdown by Month
                </h4>
                {selectedCollection.items &&
                selectedCollection.items.length > 0 ? (
                  <div className="border rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-xs font-bold w-[60px] text-center">
                            Mth
                          </TableHead>
                          <TableHead className="text-xs font-bold text-right text-rose-500">
                            Penalty
                          </TableHead>
                          <TableHead className="text-xs font-bold text-right">
                            Base Due
                          </TableHead>
                          <TableHead className="text-xs font-bold text-right text-emerald-600">
                            Total Paid
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCollection.items.map((item: any) => (
                          <TableRow key={item.id} className="text-sm">
                            <TableCell className="font-bold text-center">
                              #{item.instalment?.monthNumber}
                            </TableCell>
                            <TableCell className="text-right font-medium text-rose-500">
                              {Number(item.penaltyPaid) > 0
                                ? `Rs. ${Number(item.penaltyPaid).toLocaleString()}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {Number(item.duePaid) > 0
                                ? `Rs. ${Number(item.duePaid).toLocaleString()}`
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right font-bold text-emerald-600">
                              Rs. {Number(item.totalPaid).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic border rounded-xl p-4 bg-muted/10">
                    This entire payment was applied directly as a principal
                    reduction.
                  </div>
                )}
              </div>

              {selectedCollection.notes && (
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl text-sm border border-amber-200 dark:border-amber-900/50">
                  <p className="font-bold mb-1 text-[10px] uppercase tracking-widest opacity-70">
                    Payment Notes
                  </p>
                  <p className="font-medium">{selectedCollection.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Error loading details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
