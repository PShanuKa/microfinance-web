"use client";

import React, { useState } from "react";
import { 
  Users, 
  Banknote, 
  HandCoins, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Building,
  ArrowUpRight,
  CheckCircle2,
  Clock
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBranchesQuery } from "@/services/branchApi";
import { useDashboardStatsQuery } from "@/services/dashboardApi";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");

  const { data: branchesData } = useBranchesQuery();
  const { data: statsData, isLoading } = useDashboardStatsQuery(
    selectedBranchId === "all" ? undefined : selectedBranchId
  );

  const branches = branchesData?.branches || [];
  const stats = statsData?.stats;

  const kpis = [
    { 
      title: "Total Groups", 
      value: stats?.totalGroups?.toString() || "0", 
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      description: "Active savings & loan groups"
    },
    { 
      title: "Outstanding Portfolio", 
      value: `Rs. ${(stats?.totalOutstanding || 0).toLocaleString()}`, 
      icon: Banknote, 
      color: "text-primary", 
      bg: "bg-primary/10",
      description: "Current unpaid loan balance"
    },
    { 
      title: "Total Collected Amount", 
      value: `Rs. ${(stats?.totalCollected || 0).toLocaleString()}`, 
      icon: HandCoins, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10",
      description: "Total payments approved" 
    },
    { 
      title: "Collection Rate", 
      value: `${stats?.collectionRate || 0}%`, 
      icon: Target, 
      color: "text-indigo-500", 
      bg: "bg-indigo-500/10",
      description: "Paid ratio against total due"
    },
    { 
      title: "Active Clients", 
      value: stats?.totalClients?.toString() || "0", 
      icon: Users, 
      color: "text-amber-500", 
      bg: "bg-amber-500/10",
      description: "Active verified members" 
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Dashboard Overview"
          description="Real-time summary of portfolio performance and daily collections."
        
        />
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedBranchId} onValueChange={(val) => setSelectedBranchId(val || "all")}>
            <SelectTrigger className="w-[200px] bg-card/60 backdrop-blur-md border-none shadow-sm h-10 font-bold">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <SelectValue>
                  {selectedBranchId && selectedBranchId !== "all" 
                    ? (branches.find((b: any) => b.id.toString() === selectedBranchId)?.name || "Select Branch")
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
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Live Intelligence...</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Collections Progress Card */}
            <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Monthly Collections Trend
                    </CardTitle>
                    <CardDescription>Approved collections over the last 6 months</CardDescription>
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
                              className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary to-primary/60 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-500 shadow-md relative"
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
                      No collections approved yet in this branch.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Collections Table Log */}
            <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Recent Collections
                </CardTitle>
                <CardDescription>Latest collection actions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-muted/50">
                  {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                    stats.recentCollections.map((col: any) => (
                      <div key={col.id} className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold text-emerald-600 text-sm group-hover:scale-110 transition-transform">
                             G
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[130px]">{col.groupName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-wider">{col.groupNo}</span>
                              <Badge className={cn(
                                "text-[8px] font-black uppercase px-2 py-0 border-none",
                                col.status === "APPROVED" ? "bg-emerald-500 text-white" : 
                                col.status === "SUBMITTED" ? "bg-amber-500 text-white" :
                                "bg-rose-500 text-white"
                              )}>
                                {col.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-slate-800">Rs. {col.amount.toLocaleString()}</p>
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

          {/* Core Collection Target Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <Card className="border-none shadow-lg bg-emerald-500/5 border-emerald-500/10">
                <CardContent className="p-5 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Approved Total</p>
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
                      <Users className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Portfolio Scope</p>
                      <p className="text-xl font-black">{stats?.totalGroups || 0} active groups</p>
                   </div>
                </CardContent>
             </Card>
          </div>
        </>
      )}
    </div>
  );
}