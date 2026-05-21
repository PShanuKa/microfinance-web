"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  Search,
  Filter,
  Wallet,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
  Banknote,
  Receipt,
  FileUp,
  ClipboardList,
  TrendingUp,
  Landmark,
  BadgePercent
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
import { useRouter } from "next/navigation";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMortgageCollectionsQuery, useMortgageCollectionQuery } from "@/services/mortgageLoanApi";
import TablePagination from "@/components/Custom/TablePagination";
import { format } from "date-fns";
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";

export default function MortgageCollectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  
  const { data, isLoading } = useMortgageCollectionsQuery({ page, limit: 20, search: searchTerm });
  const collections = data?.collections || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const { data: detailsData, isLoading: detailsLoading } = useMortgageCollectionQuery(selectedCollectionId || "", {
    enabled: !!selectedCollectionId,
  });

  const selectedCollection = detailsData?.collection;

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Mortgage Collections"
        description="Track all mortgage loan repayments, penalties collected, and principal reductions."
      >
        <Button
          onClick={() => router.push("/mortgage-collection/create")}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </Button>
      </PageHeader>

      {/* Summary Stats Placeholder for UI consistency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-lg bg-emerald-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Banknote className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Total Collected Today
            </p>
            <p className="text-2xl font-black mt-2">Rs. 0</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-black">All Branches</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-indigo-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <Landmark className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Principal Reduced Today
            </p>
            <p className="text-2xl font-black mt-2">Rs. 0</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] font-black">Excess payments applied</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-rose-600 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
            <BadgePercent className="h-12 w-12" />
          </div>
          <CardContent className="p-6">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Penalties Recovered
            </p>
            <p className="text-2xl font-black mt-2">Rs. 0</p>
            <div className="mt-4 flex items-center gap-2 text-white/60">
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Overdue charges paid
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search by loan no or client name..."
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground w-[180px]">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Loan No
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Client Name
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium italic">
                      Loading mortgage collections...
                    </TableCell>
                  </TableRow>
                ) : collections.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-medium italic">
                      No collections found.
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((col: any) => {
                    const amount = Number(col.amount || 0);
                    const principalReduction = Number(col.principalReduction || 0);
                    
                    return (
                      <TableRow
                        key={col.id}
                        className="hover:bg-primary/5 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCollectionId(col.id)}
                      >
                        <TableCell className="font-medium text-slate-600">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{format(new Date(col.createdAt), "dd MMM yyyy")}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">{format(new Date(col.createdAt), "hh:mm a")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-primary group-hover:text-primary transition-colors">
                          {col.mortgage?.loanNo}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-bold">{col.client?.fullname}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">
                              {col.client?.clientNo}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-600">
                          Rs. {amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold text-indigo-500">
                          {principalReduction > 0 ? `Rs. ${principalReduction.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-center font-medium text-sm text-slate-600">
                          {col.collectedBy?.fullname || "System"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                              <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                                <MoreVertical className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setSelectedCollectionId(col.id)}
                                className="gap-2 cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-primary" /> View Details Breakdown
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Collection Details Dialog */}
      <Dialog open={!!selectedCollectionId} onOpenChange={(open: boolean) => !open && setSelectedCollectionId(null)}>
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
            <div className="p-8 text-center text-muted-foreground animate-pulse">Loading breakdown...</div>
          ) : selectedCollection ? (
            <div className="mt-6 space-y-6">
              {/* Core summary */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Loan Number</p>
                  <p className="font-black text-primary">{selectedCollection.mortgage?.loanNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date & Time</p>
                  <p className="font-bold">{format(new Date(selectedCollection.createdAt), "dd MMM yyyy, HH:mm")}</p>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Paid Amount</p>
                  <p className="text-3xl font-black text-emerald-600">Rs. {Number(selectedCollection.amount).toLocaleString()}</p>
                </div>
                {Number(selectedCollection.principalReduction) > 0 && (
                  <div className="col-span-2 pt-2 border-t bg-indigo-50/50 -mx-4 px-4 pb-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest pt-2">Excess Applied to Principal</p>
                    <p className="text-xl font-black text-indigo-600">Rs. {Number(selectedCollection.principalReduction).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <FileText className="h-4 w-4" /> Settlement Breakdown by Month
                </h4>
                {selectedCollection.items && selectedCollection.items.length > 0 ? (
                  <div className="border rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-xs font-bold w-[60px] text-center">Mth</TableHead>
                          <TableHead className="text-xs font-bold text-right text-rose-500">Penalty</TableHead>
                          <TableHead className="text-xs font-bold text-right">Base Due</TableHead>
                          <TableHead className="text-xs font-bold text-right text-emerald-600">Total Paid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCollection.items.map((item: any) => (
                          <TableRow key={item.id} className="text-sm">
                            <TableCell className="font-bold text-center">
                              #{item.instalment?.monthNumber}
                            </TableCell>
                            <TableCell className="text-right font-medium text-rose-500">
                              {Number(item.penaltyPaid) > 0 ? `Rs. ${Number(item.penaltyPaid).toLocaleString()}` : "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {Number(item.duePaid) > 0 ? `Rs. ${Number(item.duePaid).toLocaleString()}` : "-"}
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
                    This entire payment was applied directly as a principal reduction.
                  </div>
                )}
              </div>

              {selectedCollection.notes && (
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-4 rounded-xl text-sm border border-amber-200 dark:border-amber-900/50">
                  <p className="font-bold mb-1 text-[10px] uppercase tracking-widest opacity-70">Payment Notes</p>
                  <p className="font-medium">{selectedCollection.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">Error loading details.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
