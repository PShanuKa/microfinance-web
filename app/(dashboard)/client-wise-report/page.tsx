"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Users,
  Wallet,
  TrendingUp,
  FileUser,
  ArrowRight,
  Filter,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";
import { useClientWiseReportQuery } from "@/services/reportApi";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";

export default function ClientWiseReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [paymentStatus, setPaymentStatus] = useState("ALL");

  // Date Range State
  const [dateRange, setDateRange] = useState<{
    from: string;
    to: string;
  }>({
    from: format(startOfDay(new Date()), "yyyy-MM-dd"),
    to: format(endOfDay(new Date()), "yyyy-MM-dd"),
  });

  const { data, isLoading } = useClientWiseReportQuery({
    startDate: dateRange.from,
    endDate: dateRange.to,
    search: searchTerm,
    paymentStatus: paymentStatus !== "ALL" ? paymentStatus : undefined,
    page,
    limit,
  });

  const summary = data?.summary || {
    paidClients: 0,
    notPaidClients: 0,
    notPaidOutstanding: 0,
    totalPaid: 0,
    totalOutstanding: 0,
  };

  const reportData = data?.data || [];

  const handleShortcut = (type: "today" | "week" | "month" | "all") => {
    const today = new Date();
    if (type === "today") {
      setDateRange({
        from: format(startOfDay(today), "yyyy-MM-dd"),
        to: format(endOfDay(today), "yyyy-MM-dd"),
      });
    } else if (type === "week") {
      setDateRange({
        from: format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        to: format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      });
    } else if (type === "month") {
      setDateRange({
        from: format(startOfMonth(today), "yyyy-MM-dd"),
        to: format(endOfMonth(today), "yyyy-MM-dd"),
      });
    } else if (type === "all") {
      setDateRange({ from: "", to: "" });
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
      PARTIAL: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
      UNPAID: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
      PENDING: "bg-slate-500 hover:bg-slate-600 shadow-slate-500/20",
    };
    return (
      <Badge
        className={cn(
          "font-bold text-[10px] uppercase px-2 py-0.5 border-none text-white shadow-sm transition-all duration-300",
          colors[status] || "bg-slate-500",
        )}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Client Wise Report"
        description="View payment status and outstanding balances for each client within a selected time period."
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-emerald-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Paid Clients
            </p>
            <p className="text-3xl font-black mt-2 tracking-tighter">
              {summary.paidClients}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-100">
                In selected period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-rose-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Not Paid Clients
            </p>
            <p className="text-3xl font-black mt-2 tracking-tighter">
              {summary.notPaidClients}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-rose-100">
                In selected period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Total Amount Paid
            </p>
            <p className="text-2xl font-black mt-2">
              Rs. {Number(summary.totalPaid).toLocaleString()}
            </p>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Badge className="bg-white/20 border-none text-[9px] font-black uppercase">
                Selected Period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Total Outstanding
            </p>
            <p className="text-2xl font-black mt-2">
              Rs. {Number(summary.totalOutstanding).toLocaleString()}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-primary-foreground/80">
                Overall outstanding
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search by client name or NIC..."
          >
            <div className="flex flex-col xl:flex-row items-start xl:items-end gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-xs text-muted-foreground ml-1">Time Range</span>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                        className="pl-10 pr-4 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg font-bold w-full md:w-[150px]"
                      />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                        className="pl-10 pr-4 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg font-bold w-full md:w-[150px]"
                      />
                    </div>
                  </div>
                  
                  {/* Shortcuts */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant={dateRange.from === format(new Date(), "yyyy-MM-dd") && dateRange.to === format(new Date(), "yyyy-MM-dd") ? "default" : "outline"}
                      onClick={() => handleShortcut("today")}
                      className="h-11 rounded-lg font-bold"
                    >
                      Today
                    </Button>
                    <Button
                      variant={dateRange.from === format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd") ? "default" : "outline"}
                      onClick={() => handleShortcut("week")}
                      className="h-11 rounded-lg font-bold"
                    >
                      This Week
                    </Button>
                    <Button
                      variant={dateRange.from === format(startOfMonth(new Date()), "yyyy-MM-dd") ? "default" : "outline"}
                      onClick={() => handleShortcut("month")}
                      className="h-11 rounded-lg font-bold"
                    >
                      This Month
                    </Button>
                    <Button
                      variant={dateRange.from === "" ? "default" : "outline"}
                      onClick={() => handleShortcut("all")}
                      className="h-11 rounded-lg font-bold"
                    >
                      All Time
                    </Button>

                    <div className="ml-2 relative">
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="pl-4 pr-10 h-11 bg-background/50 border border-input/50 focus:ring-primary/20 rounded-lg font-bold w-full md:w-[180px] appearance-none"
                      >
                        <option value="ALL">All Clients</option>
                        <option value="PAID">Paid Clients</option>
                        <option value="UNPAID">Not Paid Clients</option>
                      </select>
                      <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SearchFilterPanel>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">
                    Client Info
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Group & Location
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Expected
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Paid
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Arrears
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-right">
                    Total O/S
                  </TableHead>
                  <TableHead className="font-bold text-foreground text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground font-medium italic"
                    >
                      Loading report data...
                    </TableCell>
                  </TableRow>
                ) : reportData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground font-medium italic"
                    >
                      No clients found for the selected criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((client: any) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
                        <div className="flex flex-col">
                          <span>{client.fullname}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            {client.clientNo} <span className="text-slate-300">•</span> {client.nic} <span className="text-slate-300">•</span> {client.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">{client.groupName}</span>
                          <span className="text-[10px] text-muted-foreground uppercase">
                            {client.groupNo} - {client.location}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600">
                        Rs. {Number(client.expected).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        Rs. {Number(client.collected).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-bold text-rose-500">
                        {client.arrears > 0 ? `Rs. ${Number(client.arrears).toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        Rs. {Number(client.totalOutstanding).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(client.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
