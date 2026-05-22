"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/Custom/PageHeader";
import { 
  useMortgageLoansQuery, 
  useMortgageLoanQuery, 
  useRecordMortgagePaymentMutation 
} from "@/services/mortgageLoanApi";
import { 
  Save, 
  ArrowLeft, 
  Calculator,
  Banknote,
  AlertTriangle,
  FileText,
  BadgePercent,
  CheckCircle2,
  CalendarDays,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function CreateMortgageCollectionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loanIdParam = searchParams.get("loanId");

  const [selectedLoanId, setSelectedLoanId] = useState<string>(loanIdParam || "");
  const [paymentAmountStr, setPaymentAmountStr] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [openLoanSelect, setOpenLoanSelect] = useState(false);

  // Fetch loans for dropdown
  const { data: loansData, isLoading: loansLoading } = useMortgageLoansQuery({ limit: 500 });
  const activeLoans = useMemo(() => {
    return (loansData?.mortgages || []).filter((l: any) => l.status === "APPROVED" || l.status === "COMPLETED");
  }, [loansData]);

  // Fetch selected loan details
  const { data: detailData, isLoading: detailLoading } = useMortgageLoanQuery(selectedLoanId, {
    enabled: !!selectedLoanId,
  });

  const mortgage = detailData?.mortgage;

  const recordPaymentMutation = useRecordMortgagePaymentMutation({
    onSuccess: () => {
      router.push("/mortgage-collection");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.error || "Failed to process payment");
    },
  });

  // Simulator Engine
  const simulation = useMemo(() => {
    if (!mortgage || !mortgage.instalments) return null;
    
    let amountLeft = Number(paymentAmountStr || 0);
    const totalPayment = amountLeft;
    let principalReduction = 0;
    
    // Process unpaid instalments
    const unpaidInstalments = mortgage.instalments.filter(
      (inst: any) => inst.status !== "PAID" || Number(inst.remainingDue) > 0
    );

    const breakdown = unpaidInstalments.map((inst: any) => {
      const totalPenaltyPaid = inst.collectionItems?.reduce((sum: number, item: any) => sum + Number(item.penaltyPaid || 0), 0) || 0;
      
      const outstandingPenalty = Math.max(0, Number(inst.penaltyAmount || 0) - totalPenaltyPaid);
      const outstandingBaseDue = Math.max(0, Number(inst.dueAmount || 0) - Number(inst.paidAmount || 0));

      let simPenaltyPaid = 0;
      let simDuePaid = 0;

      // Prioritize paying penalty first
      if (outstandingPenalty > 0 && amountLeft > 0) {
        const p = Math.min(amountLeft, outstandingPenalty);
        simPenaltyPaid = p;
        amountLeft -= p;
      }

      // Then pay the base due
      if (outstandingBaseDue > 0 && amountLeft > 0) {
        const d = Math.min(amountLeft, outstandingBaseDue);
        simDuePaid = d;
        amountLeft -= d;
      }

      const totalSimPaid = simPenaltyPaid + simDuePaid;
      const simRemainingDue = outstandingBaseDue - simDuePaid;
      const isSimFullyPaid = simRemainingDue === 0 && (outstandingPenalty - simPenaltyPaid) === 0;

      return {
        ...inst,
        outstandingPenalty,
        outstandingBaseDue,
        simPenaltyPaid,
        simDuePaid,
        totalSimPaid,
        simRemainingDue,
        isSimFullyPaid,
        simOutstandingPenalty: outstandingPenalty - simPenaltyPaid
      };
    });

    if (amountLeft > 0) {
      principalReduction = amountLeft;
    }

    return {
      totalPayment,
      breakdown,
      principalReduction,
      totalSimulatedAllocations: totalPayment - amountLeft
    };
  }, [mortgage, paymentAmountStr]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const amount = Number(paymentAmountStr);
    if (!selectedLoanId || amount <= 0) return;

    recordPaymentMutation.mutate({
      id: selectedLoanId,
      amount,
      notes
    });
  };

  const { totalUnpaidPenalty, totalUnpaidBaseDue } = useMemo(() => {
    let totalPenalty = 0;
    let totalBase = 0;
    
    if (mortgage && mortgage.instalments) {
      mortgage.instalments.forEach((inst: any) => {
        const totalPenaltyPaid = inst.collectionItems?.reduce((sum: number, item: any) => sum + Number(item.penaltyPaid || 0), 0) || 0;
        const outstandingPenalty = Math.max(0, Number(inst.penaltyAmount || 0) - totalPenaltyPaid);
        const outstandingBaseDue = Math.max(0, Number(inst.dueAmount || 0) - Number(inst.paidAmount || 0));
        
        totalPenalty += outstandingPenalty;
        totalBase += outstandingBaseDue;
      });
    }
    
    return { totalUnpaidPenalty: totalPenalty, totalUnpaidBaseDue: totalBase };
  }, [mortgage]);

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Record Mortgage Payment"
        description="Simulate and securely record a payment transaction with live seniority-first allocation."
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center animate-shake">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Loan Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>Select Mortgage Loan</Label>
                <Popover open={openLoanSelect} onOpenChange={setOpenLoanSelect}>
                  <PopoverTrigger
                    aria-expanded={openLoanSelect}
                    className="flex w-full items-center justify-between rounded-md border border-input bg-background/50 h-11 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring hover:bg-background/80"
                  >
                    {loansLoading ? (
                      <span className="text-muted-foreground">Loading...</span>
                    ) : selectedLoanId ? (
                      <div className="flex justify-between w-full pr-4">
                        <span className="font-bold">
                          {activeLoans.find((l: any) => l.id === selectedLoanId)?.loanNo}
                        </span>
                        <span className="text-muted-foreground ml-4 truncate max-w-[200px]">
                          {activeLoans.find((l: any) => l.id === selectedLoanId)?.client?.fullname}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Search and choose Loan No...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search loan no or client name..." />
                      <CommandList>
                        <CommandEmpty>No mortgage loans found.</CommandEmpty>
                        <CommandGroup>
                          {activeLoans.map((loan: any) => (
                            <CommandItem
                              key={loan.id}
                              value={`${loan.loanNo} ${loan.client?.fullname || ""}`}
                              onSelect={() => {
                                setSelectedLoanId(loan.id);
                                setPaymentAmountStr("");
                                setOpenLoanSelect(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedLoanId === loan.id ? "opacity-100 text-primary" : "opacity-0"
                                )}
                              />
                              <div className="flex justify-between w-full">
                                <span className="font-bold">{loan.loanNo}</span>
                                <span className="text-muted-foreground ml-4 truncate max-w-[200px]">
                                  {loan.client?.fullname}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {mortgage && (
                <div className="p-4 bg-muted/30 rounded-xl space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client Name</p>
                    <p className="font-bold text-foreground">{mortgage.client?.fullname}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Lent Amount</p>
                    <p className="font-bold text-slate-600">Rs. {Number(mortgage.lentAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Principal Paid So Far</p>
                    <p className="font-bold text-emerald-600">Rs. {Number(mortgage.principalPaid || 0).toLocaleString()}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Total Unpaid Penalty</p>
                    <p className="font-bold text-rose-500">Rs. {totalUnpaidPenalty.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Total Unpaid Instalments</p>
                    <p className="font-bold text-amber-600">Rs. {totalUnpaidBaseDue.toLocaleString()}</p>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[11px] font-black text-primary uppercase tracking-widest">Total Due (Penalty + Instalments)</p>
                    <p className="text-xl font-black text-primary">Rs. {(totalUnpaidPenalty + totalUnpaidBaseDue).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={cn(
            "border-none shadow-xl backdrop-blur-md md:col-span-2 transition-colors duration-500",
            simulation && Number(paymentAmountStr) > 0 ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/20" : "bg-card/60"
          )}>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" /> Payment & Notes
              </CardTitle>
              <CardDescription>Enter the payment amount to view live allocation simulation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-lg font-bold">Payment Amount (Rs.)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="bg-background/80 h-16 text-3xl font-black text-emerald-600 px-6 border-emerald-500/30 focus:border-emerald-500 shadow-inner"
                  value={paymentAmountStr}
                  onChange={(e) => setPaymentAmountStr(e.target.value)}
                  disabled={!mortgage}
                />
              </div>
              <div className="grid gap-2">
                <Label>Transaction Notes</Label>
                <Textarea
                  placeholder="Optional details..."
                  className="bg-background/50 min-h-[60px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!mortgage}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Simulation Indicator Card */}
        {simulation && Number(paymentAmountStr) > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none bg-primary text-primary-foreground shadow-xl md:col-span-1 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <Banknote className="h-24 w-24" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Payment Entered</p>
                <p className="text-4xl font-black mt-2">Rs. {simulation.totalPayment.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="border-none bg-emerald-600 text-white shadow-xl md:col-span-1 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <BadgePercent className="h-24 w-24" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Allocated to Arrears & Dues</p>
                <p className="text-4xl font-black mt-2">Rs. {simulation.totalSimulatedAllocations.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className={cn(
              "border-none text-white shadow-xl md:col-span-1 overflow-hidden relative group transition-colors",
              simulation.principalReduction > 0 ? "bg-indigo-600" : "bg-slate-800"
            )}>
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                <Banknote className="h-24 w-24" />
              </div>
              <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Excess to Principal Reduction</p>
                <p className="text-4xl font-black mt-2">Rs. {simulation.principalReduction.toLocaleString()}</p>
                {simulation.principalReduction > 0 && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mt-4 uppercase text-[9px] font-black">
                    Great Job!
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schedule Table */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden min-h-[300px]">
          <CardHeader className="bg-muted/10 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Allocation Breakdown Schedule
              </CardTitle>
              <CardDescription>Live simulation of how funds are distributed across active instalments</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {detailLoading ? (
               <div className="p-12 text-center text-muted-foreground italic font-medium animate-pulse">
                Loading schedule...
              </div>
            ) : !mortgage ? (
              <div className="p-12 text-center text-muted-foreground italic font-medium">
                Please select a mortgage loan to load its repayment schedule.
              </div>
            ) : mortgage.instalments.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground italic font-medium">
                No instalments found for this loan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 border-b">
                      <TableHead className="font-bold text-center w-[80px]">Month</TableHead>
                      <TableHead className="font-bold">Due Date</TableHead>
                      <TableHead className="font-bold text-right text-rose-500">Unpaid Penalty</TableHead>
                      <TableHead className="font-bold text-right">Unpaid Base</TableHead>
                      <TableHead className="font-bold text-right bg-emerald-500/5 px-4 border-l border-r border-emerald-500/20">
                        <span className="text-emerald-600 font-black tracking-widest uppercase text-[10px]">Simulated Total</span>
                      </TableHead>
                      <TableHead className="font-bold text-center w-[120px]">Live Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulation?.breakdown.map((item: any) => {
                      const hasSimPaid = item.totalSimPaid > 0;
                      
                      return (
                        <TableRow 
                          key={item.id} 
                          className={cn(
                            "transition-all duration-300",
                            hasSimPaid ? "bg-emerald-500/10 hover:bg-emerald-500/20" : "hover:bg-primary/5",
                            item.isSimFullyPaid ? "opacity-75" : ""
                          )}
                        >
                          <TableCell className="font-bold text-center text-slate-600">
                            #{item.monthNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {format(new Date(item.dueDate), "dd MMM yyyy")}
                          </TableCell>
                          
                          {/* Penalty */}
                          <TableCell className="text-right font-medium">
                            <div className="flex flex-col items-end">
                              <span className={cn("text-rose-500", item.simPenaltyPaid > 0 && "line-through opacity-50 text-xs")}>
                                Rs. {item.outstandingPenalty.toLocaleString()}
                              </span>
                              {item.simPenaltyPaid > 0 && (
                                <span className="text-emerald-600 font-bold text-xs mt-0.5">
                                  - Rs. {item.simPenaltyPaid.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          
                          {/* Base Due */}
                          <TableCell className="text-right font-medium">
                            <div className="flex flex-col items-end">
                              <span className={cn(item.simDuePaid > 0 && "line-through opacity-50 text-xs")}>
                                Rs. {item.outstandingBaseDue.toLocaleString()}
                              </span>
                              {item.simDuePaid > 0 && (
                                <span className="text-emerald-600 font-bold text-xs mt-0.5">
                                  - Rs. {item.simDuePaid.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Simulated Paid Total */}
                          <TableCell className="text-right bg-emerald-500/5 border-l border-r border-emerald-500/20 px-4">
                            {hasSimPaid ? (
                              <div className="flex items-center justify-end gap-2 text-emerald-600">
                                <span className="font-black text-lg">Rs. {item.totalSimPaid.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground opacity-50">-</span>
                            )}
                          </TableCell>

                          {/* Live Status Badge */}
                          <TableCell className="text-center">
                            {item.isSimFullyPaid ? (
                              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase border-none px-2 py-0.5 shadow-sm shadow-emerald-500/20 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> SETTLED
                              </Badge>
                            ) : hasSimPaid ? (
                              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase border-none px-2 py-0.5 shadow-sm shadow-amber-500/20">
                                PARTIAL
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-500 font-bold text-[10px] uppercase px-2 py-0.5 bg-background">
                                {item.status}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex justify-end pt-4 pb-12">
          <Button 
            type="submit" 
            size="lg" 
            disabled={recordPaymentMutation.isPending || !mortgage || Number(paymentAmountStr) <= 0}
            className="gap-2 w-full md:w-auto px-12 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 h-14 text-lg font-black tracking-wide"
          >
            {recordPaymentMutation.isPending ? "Processing Transaction..." : (
              <>
                <Save className="h-5 w-5" /> Confirm & Process Payment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateMortgageCollectionPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground animate-pulse">Loading...</div>}>
      <CreateMortgageCollectionForm />
    </Suspense>
  );
}
