"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCollectionQuery, useApproveCollectionMutation, useRejectCollectionMutation } from "@/services/collectionApi";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
// import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  Calendar,
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  MapPin,
  Phone,
  Wallet,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isOverpaymentDialogOpen, setIsOverpaymentDialogOpen] = useState(false);

  const { data, isLoading } = useCollectionQuery(collectionId);
  const collection = data?.collection;

  const approveMutation = useApproveCollectionMutation({
    onSuccess: (res: any) => {
      if (res?.success === false && res?.code === "OVERPAYMENT_DETECTED") {
        setConflicts(res.conflicts || []);
        setIsOverpaymentDialogOpen(true);
      } else {
        alert("Collection approved successfully!");
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to approve collection.");
    }
  });

  const rejectMutation = useRejectCollectionMutation({
    onSuccess: () => {
      alert("Collection rejected successfully!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to reject collection.");
    }
  });

  const handleConfirmApprove = () => {
    setIsOverpaymentDialogOpen(false);
    approveMutation.mutate({ id: collectionId, confirmOverpayment: true });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-xs">
          Loading Collection Details...
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Collection Not Found.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collections
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: "bg-emerald-500",
      SUBMITTED: "bg-blue-500",
      REJECTED: "bg-rose-500",
    };
    return (
      <Badge className={cn("font-bold text-[10px] uppercase border-none text-white", colors[status] || "bg-slate-500")}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Collection Details</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              ID: {collection.id}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {collection.loanId && (
            <Button 
              variant="outline" 
              className="font-bold border-slate-200 hover:bg-muted text-slate-800"
              onClick={() => router.push(`/loans/${collection.loanId}`)}
            >
              <Banknote className="h-4 w-4 mr-2 text-primary" />
              View Loan
            </Button>
          )}
          <Button 
            variant="outline" 
            className="font-bold border-slate-200 hover:bg-muted text-slate-800"
            onClick={() => router.push(`/groups/${collection.groupId}`)}
          >
            <Users className="h-4 w-4 mr-2 text-emerald-500" />
            View Group
          </Button>

          {collection.status === "SUBMITTED" && (
            <>
              <Button 
                variant="outline" 
                className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold"
                disabled={rejectMutation.isPending || approveMutation.isPending}
                onClick={() => rejectMutation.mutate(collectionId)}
              >
                {rejectMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                Reject Collection
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20"
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={() => approveMutation.mutate(collectionId)}
              >
                {approveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Approve & Update Balances
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Collection Summary */}
        <Card className="border-none shadow-xl bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Banknote className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Collection Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Amount Collected</p>
                <p className="text-3xl font-black mt-1">Rs. {Number(collection.amountCollected).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Week / Ins.</p>
                  <p className="font-bold">#{collection.weekNumber || collection.instalmentNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Date</p>
                  <p className="font-bold">{new Date(collection.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="pt-2">
                {getStatusBadge(collection.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group Info */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">{collection.group?.name}</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  {collection.group?.groupNo || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{collection.group?.branch} - {collection.group?.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-bold">{collection.group?.phone || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-none shadow-xl bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Metadata & Notes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Collector ID</p>
                <p className="text-sm font-bold mt-1">{collection.collectorId}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Bank Reference</p>
                <p className="text-sm font-bold mt-1">{collection.bankReference || "None"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Notes</p>
                <p className="text-xs italic opacity-80 mt-1">{collection.breakdownNotes || "No notes provided."}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Table */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Member Repayments
          </h3>
          <Badge variant="outline" className="font-bold">{collection.items?.length || 0} Records</Badge>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="font-bold text-foreground">Member Details</TableHead>
                <TableHead className="font-bold text-foreground text-center">Week</TableHead>
                <TableHead className="font-bold text-foreground text-right">Amount Paid</TableHead>
                <TableHead className="font-bold text-foreground text-center">Item Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collection.items?.map((item: any) => (
                <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.instalment?.client?.fullname}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                        {item.instalment?.client?.clientNo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-500">#{item.instalment?.weekNumber}</TableCell>
                  <TableCell className="text-right font-black text-emerald-600">
                    Rs. {Number(item.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(item.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Overpayment Warning Dialog */}
      <AlertDialog
        open={isOverpaymentDialogOpen}
        onOpenChange={setIsOverpaymentDialogOpen}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-rose-600 uppercase flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              Overpayment Detected
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
              Some instalments in this collection have already been paid (or partially paid) by other transactions. 
              If you proceed, the extra money will automatically cascade and apply to the upcoming unpaid weeks.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* List of Conflicts */}
          <div className="my-4 max-h-[200px] overflow-y-auto space-y-2 border rounded-xl p-3 bg-rose-50/20 border-rose-100">
            {conflicts.map((conflict, i) => (
              <div key={i} className="text-xs flex flex-col border-b last:border-0 pb-2 last:pb-0">
                <div className="flex justify-between items-center font-bold text-slate-800">
                  <span>{conflict.memberName}</span>
                  <Badge className="bg-rose-500 text-white text-[9px] uppercase px-1.5 font-bold border-none">
                    Week #{conflict.weekNumber} ({conflict.status})
                  </Badge>
                </div>
                <div className="flex justify-between text-muted-foreground mt-1 font-semibold">
                  <span>Payment Amount: Rs. {conflict.itemAmount.toLocaleString()}</span>
                  <span>Remaining Due: Rs. {conflict.remainingDue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold px-6 h-12">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmApprove}
              disabled={approveMutation.isPending}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 h-12 shadow-lg shadow-emerald-200 transition-all"
            >
              {approveMutation.isPending ? "Approving..." : "Yes, Apply & Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
