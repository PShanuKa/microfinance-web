"use client";

import React from "react";
import { 
  Users, 
  Banknote, 
  HandCoins, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  Target,
  Calendar,
  Building,
  User,
  ArrowUpRight,
  ArrowDownRight,
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const dashboardData = {
  kpis: [
    { title: "Total Groups", value: "124", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Loan Amount", value: "Rs. 24,500,000", icon: Banknote, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Received", value: "Rs. 18,245,000", icon: HandCoins, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Balance Amount", value: "Rs. 6,255,000", icon: Wallet, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Total Outstanding", value: "Rs. 1,420,000", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Outstanding Groups", value: "18", icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
  ],
  todayCollection: {
    target: 450000,
    collected: 315000,
    percentage: 70,
    groupsVisited: 12,
    totalGroupsToday: 15
  },
  officers: [
    { name: "Saman Perera", collected: 125000, target: 150000, percentage: 83, status: "On-Track" },
    { name: "Kamal Siri", collected: 90000, target: 150000, percentage: 60, status: "Delayed" },
    { name: "Nimal Gunawardena", collected: 100000, target: 100000, percentage: 100, status: "Completed" },
  ]
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Dashboard Overview"
          description="Real-time summary of portfolio performance and daily collections."
          className="py-0 md:py-0"
        />
        
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[140px] bg-card/60 backdrop-blur-md border-none shadow-sm h-10 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Period" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-branches">
            <SelectTrigger className="w-[160px] bg-card/60 backdrop-blur-md border-none shadow-sm h-10 font-medium">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Branch" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-branches">All Branches</SelectItem>
              <SelectItem value="colombo-north">Colombo North</SelectItem>
              <SelectItem value="kaduwela">Kaduwela</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-officers">
            <SelectTrigger className="w-[180px] bg-card/60 backdrop-blur-md border-none shadow-sm h-10 font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Officer" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-officers">All Officers</SelectItem>
              <SelectItem value="saman">Saman Perera</SelectItem>
              <SelectItem value="kamal">Kamal Siri</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dashboardData.kpis.map((kpi, i) => (
          <Card key={i} className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className={cn("absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", kpi.color)}>
              <kpi.icon className="h-12 w-12" />
            </div>
            <CardContent className="p-5">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{kpi.title}</p>
                <p className={cn("text-lg font-black tracking-tight", kpi.color)}>{kpi.value}</p>
              </div>
              <div className={cn("mt-4 w-8 h-1 rounded-full", kpi.bg.replace('/10', '/40'))} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Collection Card */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Target className="h-32 w-32" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <HandCoins className="h-5 w-5 text-emerald-500" />
                  Today's Collection Overview
                </CardTitle>
                <CardDescription>Daily progress against collection targets</CardDescription>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none font-bold px-3">
                 Live Update
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Collected So Far</p>
                      <p className="text-4xl font-black text-emerald-600">Rs. {dashboardData.todayCollection.collected.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-muted-foreground uppercase">Daily Target</p>
                      <p className="text-xl font-bold">Rs. {dashboardData.todayCollection.target.toLocaleString()}</p>
                   </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>{dashboardData.todayCollection.percentage}% Complete</span>
                    <span className="text-muted-foreground">Rs. {(dashboardData.todayCollection.target - dashboardData.todayCollection.collected).toLocaleString()} Remaining</span>
                  </div>
                  <Progress value={dashboardData.todayCollection.percentage} className="h-3 bg-emerald-500/10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                       <Users className="h-3.5 w-3.5" />
                       Groups Visited
                    </div>
                    <p className="text-2xl font-black">{dashboardData.todayCollection.groupsVisited} <span className="text-sm font-medium text-muted-foreground">/ {dashboardData.todayCollection.totalGroupsToday}</span></p>
                 </div>
                 <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 space-y-2">
                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase">
                       <Clock className="h-3.5 w-3.5" />
                       Average Time
                    </div>
                    <p className="text-2xl font-black">12 <span className="text-sm font-medium text-muted-foreground">min / group</span></p>
                 </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-muted/50 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  9 Groups Verified
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-rose-500" />
                  3 Groups Pending Collection
               </div>
               <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground ml-auto">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  +12% compared to yesterday
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Officer Performance Card */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Officer Performance
            </CardTitle>
            <CardDescription>Individual collection targets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-muted/50">
              {dashboardData.officers.map((officer, i) => (
                <div key={i} className="p-5 space-y-3 hover:bg-primary/5 transition-colors group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm group-hover:scale-110 transition-transform">
                         {officer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{officer.name}</p>
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase px-2 py-0",
                          officer.status === "On-Track" ? "text-emerald-600 border-emerald-500/20" : 
                          officer.status === "Completed" ? "bg-emerald-500 text-white border-none" :
                          "text-amber-600 border-amber-500/20"
                        )}>
                          {officer.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold">Rs. {officer.collected.toLocaleString()}</p>
                       <p className="text-[10px] text-muted-foreground">Target: {officer.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold">
                       <span>{officer.percentage}%</span>
                       <span className={cn(
                         officer.percentage >= 100 ? "text-emerald-600" : "text-muted-foreground"
                       )}>
                         {officer.percentage >= 100 ? "Target Achieved" : "In Progress"}
                       </span>
                    </div>
                    <Progress value={officer.percentage} className={cn(
                      "h-1.5",
                      officer.percentage >= 100 ? "bg-emerald-500/20" : "bg-muted"
                    )} />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-muted/50">
               <Button variant="ghost" className="w-full text-xs font-bold text-primary gap-2">
                  View Detailed Rankings
                  <ArrowUpRight className="h-3 w-3" />
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="border-none shadow-lg bg-emerald-500/5 border-emerald-500/10">
            <CardContent className="p-5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Verified Collections</p>
                  <p className="text-xl font-black">Rs. 245,000</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-lg bg-amber-500/5 border-amber-500/10">
            <CardContent className="p-5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Clock className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Pending Approval</p>
                  <p className="text-xl font-black">Rs. 70,000</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-lg bg-primary/5 border-primary/10">
            <CardContent className="p-5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <ArrowUpRight className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Month-on-Month Growth</p>
                  <p className="text-xl font-black">+14.2%</p>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-lg bg-rose-500/5 border-rose-500/10">
            <CardContent className="p-5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <ArrowDownRight className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Arrears Rate</p>
                  <p className="text-xl font-black">2.4%</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}