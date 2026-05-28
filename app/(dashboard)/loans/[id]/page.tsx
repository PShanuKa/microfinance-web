"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  History as HistoryIcon,
  Info,
  Printer,
  User,
  Users,
  CreditCard,
  Building,
  TrendingUp,
  XCircle,
  FileCheck,
  Wallet,
  ArrowUpRight,
  Receipt,
  LayoutList,
  Crown,
  Grid,
  Phone,
  CalendarDays,
  ShieldCheck,
  MapPin,
  ChevronDown,
  Eye,
  ShieldAlert,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useLoanQuery,
  useLoanInstalmentsQuery,
  useApproveLoanMutation,
  useUpdateLoanStatusMutation,
  useCompleteLoanMutation,
  loanService,
  useRejectLoanMutation,
} from "@/services/loanApi";
import { format } from "date-fns";
// import { toast } from "sonner";
import { LoanGuarantorViewModal } from "@/components/Custom/LoanGuarantorViewModal";
import { AuditHistory } from "@/components/Custom/AuditHistory";
import TableAuditLogs from "../../audit-logs/Table";
import { RoleGate } from "@/components/Custom/RoleGate";
import { useDialogStore } from "@/store/useDialogStore";

export default function LoanViewPage() {
  const router = useRouter();
  const { id } = useParams();
  const { setOpen: openDialog } = useDialogStore();

  const { data, isLoading: isLoanLoading } = useLoanQuery(id as string);
  const { data: instalmentsData, isLoading: isInstalmentsLoading } =
    useLoanInstalmentsQuery(id as string);

  const approveMutation = useApproveLoanMutation();
  const rejectMutation = useRejectLoanMutation();
  const statusMutation = useUpdateLoanStatusMutation();
  const completeMutation = useCompleteLoanMutation();

  const [isSendForApprovalOpen, setIsSendForApprovalOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const blob = await loanService.exportLoanToPdf(id as string);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Loan-${data?.loan?.loanNo || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Print failed:", error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleSendForApprovalConfirm = () => {
    setIsSendForApprovalOpen(false);
    statusMutation.mutate(
      { id: id as string, status: "PENDING" },
      {
        onSuccess: () => {
          setSuccessMessage(
            "Loan has been successfully submitted for approval!",
          );
          setIsSuccessOpen(true);
        },
      },
    );
  };

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeGuarantor, setActiveGuarantor] = useState<any>(null);
  const [activeMemberName, setActiveMemberName] = useState("");

  const loan = data?.loan;
  const instalments = instalmentsData?.instalments;

  const [scheduleView, setScheduleView] = useState<"table" | "matrix">("table");

  const matrixData = useMemo(() => {
    if (!instalments) return { weeks: [], clients: [] };
    const weeksSet = new Set<number>();
    const clientsMap = new Map<string, any>();
    
    instalments.forEach((inst: any) => {
      weeksSet.add(inst.weekNumber);
      if (!clientsMap.has(inst.clientId)) {
        clientsMap.set(inst.clientId, inst.client);
      }
    });
    
    const weeks = Array.from(weeksSet).sort((a, b) => a - b);
    const clients = Array.from(clientsMap.entries()).map(([clientId, client]) => ({
      ...client,
      clientId
    }));
    
    return { weeks, clients };
  }, [instalments]);

  const stats = useMemo(() => {
    if (!loan || !instalments) return null;

    const totalMembers = loan.group?.members?.length || 0;
    const leaderLent = Number(loan.leaderLentAmount);
    const memberLent = Number(loan.memberLentAmount);

    const principal = leaderLent + memberLent * (totalMembers - 1);
    const paid = instalments.reduce(
      (acc: number, inst: any) => acc + Number(inst.paidAmount),
      0,
    );
    const totalScheduled = instalments.reduce(
      (acc: number, inst: any) => acc + Number(inst.dueAmount),
      0,
    );
    const balance = totalScheduled - paid;
    const outstanding = instalments.reduce((acc: number, inst: any) => {
      const isPast = new Date(inst.dueDate) < new Date();
      return isPast && inst.status !== "PAID"
        ? acc + Number(inst.remainingDue)
        : acc;
    }, 0);

    return {
      principal,
      paid,
      balance,
      outstanding,
      totalScheduled,
      progress: totalScheduled > 0 ? (paid / totalScheduled) * 100 : 0,
    };
  }, [loan, instalments]);

  const memberSummaries = useMemo(() => {
    if (!loan?.group?.members || !instalments) return [];

    return loan.group.members.map((m: any) => {
      const memberInstalments = instalments.filter(
        (inst: any) => inst.clientId === m.clientId,
      );
      const principal = m.isLeader
        ? Number(loan.leaderLentAmount)
        : Number(loan.memberLentAmount);
      const loanAmount = memberInstalments.reduce(
        (acc: number, inst: any) => acc + Number(inst.dueAmount),
        0,
      );
      const paid = memberInstalments.reduce(
        (acc: number, inst: any) => acc + Number(inst.paidAmount),
        0,
      );
      const balance = loanAmount - paid;
      const outstanding = memberInstalments.reduce((acc: number, inst: any) => {
        const isPast = new Date(inst.dueDate) < new Date();
        return isPast && inst.status !== "PAID"
          ? acc + Number(inst.remainingDue)
          : acc;
      }, 0);
      const arrearsCount = memberInstalments.filter((inst: any) => {
        const isPast = new Date(inst.dueDate) < new Date();
        return isPast && inst.status !== "PAID";
      }).length;

      const guarantors = loan.guarantors.filter(
        (g: any) => g.clientId === m.clientId,
      );

      return {
        ...m,
        principal,
        loanAmount,
        interest: loanAmount - principal,
        paid,
        balance,
        outstanding,
        arrearsCount,
        guarantors,
      };
    });
  }, [loan, instalments]);

  const handleApproveConfirm = () => {
    setIsApproveOpen(false);
    approveMutation.mutate(
      { id: id as string, approvedById: "system" },
      {
        onSuccess: () => {
          setSuccessMessage(
            "Loan application approved and repayment instalments rescheduled successfully!",
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
          setSuccessMessage("Loan application has been successfully rejected.");
          setIsSuccessOpen(true);
          setRejectionReason("");
        },
      },
    );
  };

  if (isLoanLoading || isInstalmentsLoading)
    return (
      <div className="p-10 text-center font-medium animate-pulse">
        Loading loan details...
      </div>
    );
  if (!loan)
    return <div className="p-10 text-center font-medium">Loan not found.</div>;

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
      case "REJECTED":
        return (
          <Badge
            className={cn(
              baseStyle,
              "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-sm shadow-rose-500/10",
            )}
          >
            <XCircle className="h-3 w-3" />
            Rejected
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

  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">
                {loan.loanNo}
              </h1>
              {getStatusBadge(loan.status)}
            </div>
            <p className="text-sm text-muted-foreground font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" /> {loan.group?.name}{" "}
              <span className="opacity-40">|</span>{" "}
              <Building className="w-4 h-4" />{" "}
              {loan.group?.branch?.name || "Main"} Branch
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <RoleGate allowedRoles={["LOAN_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
            {loan.status === "DRAFT" && (
              <Button
                onClick={() => setIsSendForApprovalOpen(true)}
                className="gap-2 bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 h-11 px-6 font-bold text-white"
                disabled={statusMutation.isPending}
              >
                {statusMutation.isPending ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Send for Approval
              </Button>
            )}
          </RoleGate>

          <RoleGate allowedRoles={["APPROVER", "BRANCH_MANAGER", "ADMIN"]}>
            {loan.status === "PENDING" && (
              <>
                <Button
                  onClick={() => setIsApproveOpen(true)}
                  variant="default"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 h-11 px-6 font-bold"
                  disabled={approveMutation.isPending}
                >
                  <FileCheck className="h-4 w-4" /> Approve Loan
                </Button>
                <Button
                  onClick={() => setIsRejectOpen(true)}
                  variant="destructive"
                  className="gap-2 shadow-lg shadow-rose-600/20 h-11 px-6 font-bold"
                  disabled={rejectMutation.isPending}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </>
            )}

            {(loan.status === "ACTIVE" || loan.status === "APPROVED") && stats?.balance <= 0 && (
              <Button
                onClick={() => {
                  openDialog({
                    open: true,
                    type: "confirmation",
                    title: "Complete Loan",
                    message: "Are you sure you want to mark this loan as completed?",
                    onConfirm: () => {
                      completeMutation.mutate(id as string, {
                        onSuccess: () => {
                          setSuccessMessage("Loan successfully marked as completed!");
                          setIsSuccessOpen(true);
                        }
                      });
                    }
                  });
                }}
                variant="default"
                className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 h-11 px-6 font-bold"
                disabled={completeMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4" /> 
                {completeMutation.isPending ? "Completing..." : "Complete Loan"}
              </Button>
            )}
          </RoleGate>
          <RoleGate allowedRoles={["LOAN_OFFICER" , "BRANCH_MANAGER" , "ADMIN"]}>


          {(loan.status === "DRAFT" || loan.status === "PENDING") && (
            <Button
              variant="outline"
              className="gap-2 h-11 px-6 font-bold"
              onClick={() => router.push(`/loans/${id}/edit-schedule`)}
            >
              <FileText className="h-4 w-4" /> Edit Schedule
            </Button>
          )}
          </RoleGate>
          <Button 
            variant="outline" 
            className="gap-2 h-11 px-6 font-bold"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            {isPrinting ? <Clock className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
            {isPrinting ? "Generating..." : "Print"}
          </Button>
        </div>
      </div>

      {loan.status === "REJECTED" && (
        <Card className="border-none shadow-xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-md overflow-hidden">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-600 shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider text-rose-800">
                Loan Application Rejected
              </h4>
              <p className="text-sm font-semibold text-rose-700 leading-relaxed">
                {loan.rejectionReason || "No rejection reason specified."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Crown className="w-4 h-4" /> Group Leader
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">
                      {loan.group?.members?.find((m: any) => m.isLeader)?.client
                        ?.fullname || "No Leader"}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3" />{" "}
                      {loan.group?.members?.find((m: any) => m.isLeader)?.client
                        ?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4" /> Collection Cycle
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <CalendarDays className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight text-amber-700">
                      Every {DAYS[loan.group?.collectionDay - 1]}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-tighter">
                      Automatic Weekly Cycle
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
          <CardContent className="p-6 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Processing Fee
              </p>
              <p className="text-xl font-black text-slate-800">
                Rs. {Number(loan.processingFee).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Loan Duration
              </p>
              <p className="text-xl font-black text-slate-800">
                {loan.totalWeeks} Weeks
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Weekly Leader
              </p>
              <p className="text-sm font-bold text-emerald-600">
                Rs. {Number(loan.leaderWeeklyAmount).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Weekly Member
              </p>
              <p className="text-sm font-bold text-emerald-600">
                Rs. {Number(loan.memberWeeklyAmount).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-foreground" /> Loan
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Total Principal
              </span>
              <span className="text-2xl font-black text-white group-hover:scale-105 transition-transform origin-left">
                Rs. {stats?.principal.toLocaleString()}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Paid Amount
              </span>
              <span className="text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform origin-left">
                Rs. {stats?.paid.toLocaleString()}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary-foreground" />{" "}
                Balance Amount
              </span>
              <span className="text-2xl font-black text-primary-foreground group-hover:scale-105 transition-transform origin-left">
                Rs. {stats?.balance.toLocaleString()}
              </span>
            </div>
            <div className="p-6 flex flex-col gap-1 hover:bg-white/5 transition-colors group">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1">
                <Receipt className="w-3 h-3 text-amber-400" /> Total Outstanding
              </span>
              <span className="text-2xl font-black text-amber-400 group-hover:scale-105 transition-transform origin-left">
                Rs. {stats?.outstanding.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="h-1 bg-white/5 w-full">
            <div
              className="h-full bg-primary shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000"
              style={{ width: `${stats?.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="bg-card/40 backdrop-blur-md border h-14 p-1 gap-2 mb-6 justify-start w-full md:w-auto">
          <TabsTrigger
            value="structure"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full"
          >
            <LayoutList className="h-4 w-4" />
            Loan Structure
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full"
          >
            <Calendar className="h-4 w-4" />
            Repayment Schedule
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold rounded-lg transition-all h-full"
          >
            <HistoryIcon className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="structure"
          className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-primary/20">
            <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Users className="w-5 h-5 text-primary" /> Member Performance
                  & Guarantors
                </CardTitle>
                <CardDescription className="font-medium">
                  Current status and financial metrics for each group member
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="font-black bg-background/50 px-3 py-1"
              >
                {loan.group?._count?.members || 0} Linked Profiles
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                      <TableHead className="font-bold text-foreground">
                        Member
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-right">
                        Principal
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-right">
                        Paid
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-right text-primary">
                        Balance
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-center">
                        Guarantors
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-center">
                        Arrears
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberSummaries.map((member: any) => (
                      <TableRow
                        key={member.clientId}
                        className="hover:bg-primary/5 transition-colors group border-b last:border-0"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-black flex items-center gap-1.5 text-slate-800 group-hover:text-primary transition-colors">
                              {member.client?.fullname}
                              {member.isLeader && (
                                <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                              )}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                              {member.client?.clientNo}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-slate-600">
                          Rs. {member.principal.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-black text-emerald-600">
                          Rs. {member.paid.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-black text-primary">
                          Rs. {member.balance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="gap-2 font-bold text-primary hover:bg-primary/5 flex items-center cursor-pointer">
                                <ShieldCheck className="w-4 h-4" />
                                {member.guarantors.length} Guarantors
                                <ChevronDown className="w-3 h-3 ml-1 opacity-40" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="w-56 p-2 rounded-xl shadow-xl border-slate-200 bg-card/95 backdrop-blur-md"
                            >
                              <div className="px-2 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Select Guarantor
                              </div>

                              {[0, 1].map((idx) => {
                                const g = member.guarantors.find(
                                  (gu: any) => gu.index === idx,
                                );
                                return (
                                  <React.Fragment key={idx}>
                                    {idx > 0 && (
                                      <DropdownMenuSeparator className="my-1" />
                                    )}
                                    <DropdownMenuItem
                                      disabled={!g}
                                      className={cn(
                                        "rounded-lg font-bold py-2.5 cursor-pointer gap-2",
                                        g
                                          ? "focus:bg-primary/5 focus:text-primary"
                                          : "opacity-30 grayscale cursor-not-allowed",
                                      )}
                                      onClick={() => {
                                        if (g) {
                                          setActiveGuarantor(g);
                                          setActiveMemberName(
                                            member.client?.fullname,
                                          );
                                          setIsViewModalOpen(true);
                                        }
                                      }}
                                    >
                                      {g ? (
                                        <Eye className="w-4 h-4 text-slate-400" />
                                      ) : (
                                        <ShieldAlert className="w-4 h-4 text-slate-300" />
                                      )}
                                      <div className="flex flex-col">
                                        <span className="text-xs">
                                          Guarantor {idx + 1}
                                        </span>
                                        {g && (
                                          <span className="text-[9px] text-muted-foreground line-clamp-1">
                                            {g.fullname}
                                          </span>
                                        )}
                                      </div>
                                    </DropdownMenuItem>
                                  </React.Fragment>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "font-black px-2.5 py-0.5 rounded-full border-none",
                              member.arrearsCount > 0
                                ? "bg-rose-500 text-white animate-pulse"
                                : "bg-slate-200 text-slate-500",
                            )}
                          >
                            {member.arrearsCount}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="schedule"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden border-t-2 border-t-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10">
              <div>
                <CardTitle className="font-bold text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" /> Full Repayment Schedule
                </CardTitle>
              </div>
              <div className="flex bg-muted/50 rounded-lg p-1 border">
                <button
                  onClick={() => setScheduleView("table")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1",
                    scheduleView === "table"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutList className="w-3 h-3" /> Table
                </button>
                <button
                  onClick={() => setScheduleView("matrix")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1",
                    scheduleView === "matrix"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Grid className="w-3 h-3" /> Grid
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                {scheduleView === "table" ? (
                  <Table className="relative">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                        <TableHead className="font-bold text-foreground">
                          Week
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          Client
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          Due Date
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          Target
                        </TableHead>
                        <TableHead className="font-bold text-foreground">
                          Collected
                        </TableHead>
                        <TableHead className="text-center font-bold text-foreground">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {instalments.map((inst: any) => (
                        <TableRow
                          key={inst.id}
                          className={cn(
                            "hover:bg-amber-500/5 transition-colors border-b last:border-0",
                            inst.status === "PAID" ? "bg-emerald-500/[0.02]" : "",
                          )}
                        >
                          <TableCell className="text-sm font-semibold text-slate-600">
                            #{inst.weekNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {inst.client?.fullname}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {inst.client?.clientNo}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                              {format(new Date(inst.dueDate), "PPP")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                              Rs. {Number(inst.dueAmount).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                              Rs. {Number(inst.paidAmount).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-4">
                            <Badge
                              className={cn(
                                "font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-tighter border-none",
                                inst.status === "PAID"
                                  ? "bg-emerald-500 text-white"
                                  : inst.status === "PARTIAL"
                                    ? "bg-amber-500 text-white"
                                    : inst.status === "OVERDUE"
                                      ? "bg-rose-500 text-white animate-pulse"
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
                ) : (
                  <Table className="relative">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                        <TableHead className="font-bold text-foreground sticky left-0 bg-muted/30 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Client</TableHead>
                        {matrixData.weeks.map(w => (
                          <TableHead key={w} className="font-bold text-foreground text-center whitespace-nowrap min-w-[120px]">Week {w}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matrixData.clients.map(c => (
                        <TableRow key={c.clientId} className="hover:bg-amber-500/5 transition-colors border-b">
                          <TableCell className="font-bold text-foreground sticky left-0 bg-background z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            {c.fullname}
                          </TableCell>
                          {matrixData.weeks.map(w => {
                            const inst = instalments.find((i: any) => i.clientId === c.clientId && i.weekNumber === w);
                            return (
                              <TableCell key={w} className="text-center font-medium border-l border-muted/30">
                                {inst ? (
                                  <div className="flex flex-col items-center gap-1.5">
                                    <span className="text-sm font-bold text-emerald-600">Rs. {Number(inst.paidAmount).toLocaleString()}</span>
                                    <span className="text-[10px] text-muted-foreground">Target: Rs. {Number(inst.dueAmount).toLocaleString()}</span>
                                    <Badge
                                      className={cn(
                                        "font-black px-2 py-0.5 rounded-full text-[8px] uppercase tracking-tighter border-none mt-1",
                                        inst.status === "PAID"
                                          ? "bg-emerald-500 text-white"
                                          : inst.status === "PARTIAL"
                                            ? "bg-amber-500 text-white"
                                            : inst.status === "OVERDUE"
                                              ? "bg-rose-500 text-white animate-pulse"
                                              : "bg-slate-200 text-slate-500"
                                      )}
                                    >
                                      {inst.status}
                                    </Badge>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <TableAuditLogs id={id as string} />
        </TabsContent>
      </Tabs>

      {/* Guarantor View Dialog (read-only) */}
      <LoanGuarantorViewModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        guarantor={activeGuarantor}
        memberName={activeMemberName}
      />

      {/* Send for Approval Confirmation AlertDialog */}
      <AlertDialog
        open={isSendForApprovalOpen}
        onOpenChange={setIsSendForApprovalOpen}
      >
        <AlertDialogContent className="rounded-3xl p-6 border-slate-200 bg-card/95 backdrop-blur-md max-w-md w-full shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-slate-800" />
              Send for Approval
            </AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-slate-500 text-sm leading-relaxed pt-2">
              Are you sure you want to submit this loan application for manager
              approval?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel className="font-bold rounded-xl border-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendForApprovalConfirm}
              className="bg-slate-900 hover:bg-slate-800 font-bold rounded-xl text-white"
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Loan Confirmation AlertDialog */}
      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogContent className="rounded-3xl p-6 border-slate-200 bg-card/95 backdrop-blur-md max-w-md w-full shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Approve Loan Application
            </AlertDialogTitle>
            <AlertDialogDescription className="font-semibold text-slate-500 text-sm leading-relaxed pt-2">
              Are you sure you want to approve this loan? This action will
              automatically regenerate and reschedule all repayment instalments
              starting from today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-4">
            <AlertDialogCancel className="font-bold rounded-xl border-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white shadow-lg shadow-emerald-600/20"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Loan Confirmation Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="rounded-3xl p-6 border-slate-200 bg-card/95 backdrop-blur-md max-w-md w-full shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <XCircle className="h-5 w-5 text-rose-500" />
              Reject Loan Application
            </DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 text-sm leading-relaxed pt-2">
              Please enter the reason for rejecting this loan application below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason here..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-24 rounded-xl border-slate-200 font-medium"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              className="font-bold rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 font-bold rounded-xl text-white shadow-lg shadow-rose-600/20"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal (Simple Tailwind CSS only) */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-emerald-500/10 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Action Successful
            </h3>
            <p className="text-slate-500 font-semibold text-xs leading-relaxed mb-6">
              {successMessage}
            </p>
            <Button
              onClick={() => setIsSuccessOpen(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-11 rounded-xl text-white shadow-lg shadow-emerald-600/20"
            >
              Great, Thank you
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
