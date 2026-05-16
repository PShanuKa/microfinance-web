"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useDailyRegistryQuery } from "@/services/collectionApi";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  MapPin,
  Phone,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegistryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const loanId = params.loanId as string;
  const date = searchParams.get("date") || "2026-06-07"; // Defaulting to the test date if not provided

  const { data, isLoading } = useDailyRegistryQuery({ loanId, date });

  const registryInfo = data?.registry?.[0];
  const instalments = data?.instalments || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-xs">
          Loading Registry Details...
        </div>
      </div>
    );
  }

  if (!registryInfo && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Registry Not Found for this date.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Registry Details</h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Collection Date: {date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Info Card */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">{registryInfo.groupName}</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  Group ID: {registryInfo.groupNo}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Location / Center</span>
                  <span className="text-sm font-bold">{registryInfo.location} - {registryInfo.center}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Leader Details</span>
                  <span className="text-sm font-bold">{registryInfo.leader}</span>
                  <span className="text-xs text-primary font-black uppercase tracking-tighter">{registryInfo.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary Card */}
        <Card className="border-none shadow-xl bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Expected Today</p>
                <p className="text-2xl font-black mt-1">Rs. {registryInfo.expected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Week Number</p>
                <p className="text-2xl font-black mt-1">#{registryInfo.instalmentNo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black uppercase opacity-60">Loan Number</p>
                <p className="text-lg font-black mt-1 tracking-widest opacity-90">{registryInfo.loanNo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Status Card */}
        <Card className={cn(
          "border-none shadow-xl relative overflow-hidden group",
          registryInfo.status === "Verified" ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
        )}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Collection Progress</h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Collected Amount</p>
                <p className="text-2xl font-black mt-1">Rs. {registryInfo.collected.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000" 
                      style={{ width: `${(registryInfo.collected / registryInfo.expected) * 100}%` }}
                    />
                 </div>
                 <span className="text-xs font-black">{Math.round((registryInfo.collected / registryInfo.expected) * 100)}%</span>
              </div>
              <Badge className="w-fit bg-white/20 border-none text-[10px] font-black uppercase">
                Status: {registryInfo.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member-wise Instalments Table */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Banknote className="h-4 w-4 text-primary" />
            Member-wise Breakdown
          </h3>
          <Badge variant="outline" className="font-bold">{instalments.length} Members</Badge>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="font-bold text-foreground">Member Details</TableHead>
                <TableHead className="font-bold text-foreground text-center">Week</TableHead>
                <TableHead className="font-bold text-foreground text-right">Due Amount</TableHead>
                <TableHead className="font-bold text-foreground text-right">Paid Amount</TableHead>
                <TableHead className="font-bold text-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instalments.map((inst: any) => (
                <TableRow key={inst.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{inst.memberName}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{inst.clientNo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-500">#{inst.weekNumber}</TableCell>
                  <TableCell className="text-right font-black text-slate-700">Rs. {inst.dueAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-black text-emerald-600">Rs. {inst.paidAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "font-bold text-[10px] uppercase px-2 py-0.5 border-none text-white",
                      inst.status === "PAID" ? "bg-emerald-500" : inst.status === "PARTIAL" ? "bg-amber-500" : "bg-slate-400"
                    )}>
                      {inst.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
