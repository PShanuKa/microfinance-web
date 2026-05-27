"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  Banknote,
  HandCoins,
  TrendingUp,
  Target,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  FileWarning,
  Users,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useBranchesQuery } from "@/services/branchApi";
import { useMortgageDashboardStatsQuery } from "@/services/dashboardApi";
import { useGetMeQuery } from "@/services/authApi";
import { Spinner } from "@/components/ui/spinner";

export default function MortgageDashboardPage() {
  const { data: currentUserData } = useGetMeQuery();
  const user = currentUserData?.user;

  const isNonAdminWithBranch = user && user.role !== "ADMIN" && user.branchId;
  const initialBranchId = isNonAdminWithBranch ? user.branchId : "all";

  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);

  useEffect(() => {
    if (isNonAdminWithBranch && selectedBranchId !== user.branchId) {
      setSelectedBranchId(user.branchId);
    }
  }, [isNonAdminWithBranch, user?.branchId, selectedBranchId]);

  const { data: branchesData } = useBranchesQuery();
  const { data: statsData, isLoading } = useMortgageDashboardStatsQuery(
    selectedBranchId === "all" ? undefined : selectedBranchId
  );

  const branches = branchesData?.branches || [];
  const stats = statsData?.stats;

  const kpis = [
    {
      title: "Total Mortgage Loans",
      value: stats?.totalMortgageLoans?.toString() || "0",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "All mortgage loans in system",
    },
    {
      title: "Active Loans",
      value: stats?.activeLoans?.toString() || "0",
      icon: BadgeCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Currently approved & active",
    },
    {
      title: "Total Lent Amount",
      value: `Rs. ${(stats?.totalLentAmount || 0).toLocaleString()}`,
      icon: Banknote,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Total capital disbursed",
    },
    {
      title: "Outstanding Balance",
      value: `Rs. ${(stats?.totalOutstanding || 0).toLocaleString()}`,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Remaining instalment dues",
    },
    {
      title: "Total Collected",
      value: `Rs. ${(stats?.totalCollected || 0).toLocaleString()}`,
      icon: HandCoins,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      description: "Total payments received",
    },
  ];

  const pendingCards = [
    {
      title: "Pending Approval",
      count: stats?.pendingLoansCount || 0,
      amount: stats?.pendingLoanAmount || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-500",
      shadowColor: "shadow-amber-500/20",
      description: "Awaiting approver review",
    },
    {
      title: "Draft Loans",
      count: stats?.draftLoansCount || 0,
      amount: stats?.draftLoanAmount || 0,
      icon: FileWarning,
      color: "text-orange-600",
      bg: "bg-orange-500",
      shadowColor: "shadow-orange-500/20",
      description: "Not yet submitted",
    },
    {
      title: "Overdue Instalments",
      count: stats?.overdueInstalments || 0,
      amount: null,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-500",
      shadowColor: "shadow-rose-500/20",
      description: "Past due date & unpaid",
    },
    {
      title: "Completed Loans",
      count: stats?.completedLoans || 0,
      amount: null,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      shadowColor: "shadow-emerald-500/20",
      description: "Fully settled",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Mortgage Dashboard"
          description="Real-time overview of mortgage loan portfolio, pending approvals, and collections."
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={selectedBranchId}
            onValueChange={(val) => setSelectedBranchId(val || "all")}
            disabled={!!isNonAdminWithBranch}
          >
            <SelectTrigger className="w-[200px] bg-card/60 backdrop-blur-md border-none shadow-sm h-10 font-bold disabled:opacity-70 disabled:cursor-not-allowed">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <SelectValue>
                  {selectedBranchId && selectedBranchId !== "all"
                    ? branches.find((b: any) => b.id.toString() === selectedBranchId)?.name || "Select Branch"
                    : "All Branches"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-bold">All Branches</SelectItem>
              {branches.map((b: any) => (
                <SelectItem key={b.id} value={b.id.toString()} className="font-medium">
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-card/40 backdrop-blur-md rounded-3xl border border-muted/20">
          <Spinner className="w-10 h-10 text-primary mb-3" />
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Mortgage Intelligence...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((kpi, i) => (
              <Card key={i} className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
                <div className={cn("absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", kpi.color)}>
                  <kpi.icon className="h-12 w-12" />
                </div>
                <CardContent className="p-5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{kpi.title}</p>
                    <p className={cn("text-lg font-black tracking-tight", kpi.color)}>{kpi.value}</p>
                    <p className="text-[9px] font-medium text-muted-foreground/80">{kpi.description}</p>
                  </div>
                  <div className={cn("mt-4 w-8 h-1 rounded-full", kpi.bg.replace('/10', '/40'))} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pending / Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pendingCards.map((card, i) => (
              <Card key={i} className={cn("border-none shadow-lg", `${card.bg}/5`, `border-${card.bg}/10`)}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg", card.bg, card.shadowColor)}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase">{card.title}</p>
                    <p className="text-xl font-black">
                      {card.count} {card.count === 1 ? "Loan" : "Loans"}
                    </p>
                    {card.amount !== null && (
                      <p className="text-xs font-semibold text-muted-foreground">
                        Rs. {card.amount.toLocaleString()}
                      </p>
                    )}
                    <p className="text-[9px] font-medium text-muted-foreground/70 mt-0.5">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Collections Trend */}
            <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Monthly Collections Trend
                    </CardTitle>
                    <CardDescription>Mortgage payments received over the last 6 months</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-end justify-between h-[250px] gap-4 px-4 pb-2 border-b border-muted/50">
                  {stats?.chartData && stats.chartData.length > 0 ? (
                    (() => {
                      const maxAmount = Math.max(...stats.chartData.map((c: any) => c.amount), 1);
                      return stats.chartData.map((c: any, index: number) => {
                        const heightPercent = `${Math.max((c.amount / maxAmount) * 100, 5)}%`;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-xl -translate-y-1">
                              Rs. {c.amount.toLocaleString()}
                            </div>
                            <div
                              style={{ height: heightPercent }}
                              className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary to-primary/60 hover:from-teal-500 hover:to-teal-400 transition-all duration-500 shadow-md relative"
                            >
                              <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter mt-1">{c.month}</span>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground text-sm font-medium">
                      No mortgage collections recorded yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Mortgage Collections */}
            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-teal-500" />
                  Recent Collections
                </CardTitle>
                <CardDescription>Latest mortgage payment activity</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/50">
                  {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                    stats.recentCollections.map((col: any) => (
                      <div key={col.id} className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center font-bold text-teal-600 text-sm group-hover:scale-110 transition-transform">
                            M
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[130px]">{col.clientName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">{col.loanNo}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-foreground">Rs. {col.amount.toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-muted-foreground">{new Date(col.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-sm font-medium text-muted-foreground">
                      No collections found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg bg-teal-500/5 border-teal-500/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <HandCoins className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Total Collected</p>
                  <p className="text-xl font-black">Rs. {(stats?.totalCollected || 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-amber-500/5 border-amber-500/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Outstanding Total</p>
                  <p className="text-xl font-black">Rs. {(stats?.totalOutstanding || 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-primary/5 border-primary/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Collection Progress</p>
                  <p className="text-xl font-black">{stats?.collectionRate || 0}% Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-rose-500/5 border-rose-500/10">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Overdue Risk</p>
                  <p className="text-xl font-black">{stats?.overdueInstalments || 0} instalments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
