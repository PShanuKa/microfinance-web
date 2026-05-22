"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/Custom/PageHeader";
import { useGroupsQuery, useCollectionSheetQuery } from "@/services/groupApi";
import { useCreateCollectionMutation } from "@/services/collectionApi";
import { 
  Save, 
  ArrowLeft, 
  Users, 
  Calendar, 
  CircleDollarSign,
  Banknote,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Crown,
  History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function CreateCollectionPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: groupsData } = useGroupsQuery({ limit: 100 });
  const createMutation = useCreateCollectionMutation({
    onSuccess: () => {
      router.push("/groups");
    },
    onError: (error: any) => {
      setServerError(error.response?.data?.error || "Failed to process collection");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      groupId: "",
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      instalmentNumber: 1,
      bankReference: "",
      breakdownNotes: "",
      payments: [] as any[],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "payments",
  });

  const selectedGroupId = watch("groupId");
  const selectedWeek = watch("instalmentNumber");

  const { data: sheetData, isLoading: sheetLoading } = useCollectionSheetQuery(selectedGroupId, Number(selectedWeek));

  useEffect(() => {
    if (sheetData?.members) {
      const initialPayments = sheetData.members.map((m: any) => ({
        clientId: m.clientId,
        fullname: m.fullname,
        isLeader: m.isLeader,
        dueAmount: m.remainingDue,
        amount: m.remainingDue, // Default to paying full due
      }));
      replace(initialPayments);
    } else {
      replace([]);
    }
  }, [sheetData, replace]);

  const watchPayments = watch("payments");
  const totalCollected = watchPayments?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

  const onSubmit = (data: any) => {
    setServerError(null);
    createMutation.mutate({
      ...data,
      instalmentNumber: Number(data.instalmentNumber),
      collectorId: "system",
      payments: data.payments.map((p: any) => ({
        clientId: p.clientId,
        amount: Number(p.amount),
      })),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Manual Collection Entry"
        description="Select group and week to record individual member payments"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center animate-shake">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Select Group</Label>
                <Select onValueChange={(val: string | null) => setValue("groupId", (val as string) || "")}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Choose Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupsData?.groups?.map((group: any) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Collection Week</Label>
                <Input
                  type="number"
                  className="bg-background/50"
                  {...register("instalmentNumber", { required: true, min: 1 })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  type="datetime-local"
                  className="bg-background/50"
                  {...register("date", { required: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-500" /> Reference & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Bank Reference / Slip ID</Label>
                <Input
                  placeholder="e.g. DEP-123456"
                  className="bg-background/50"
                  {...register("bankReference")}
                />
              </div>
              <div className="grid gap-2">
                <Label>Breakdown Notes</Label>
                <Textarea
                  placeholder="Notes about today's collection..."
                  className="bg-background/50 min-h-[60px]"
                  {...register("breakdownNotes")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Payments Table */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Member Payments
              </CardTitle>
              <CardDescription>Enter individual amounts collected from each member</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-black text-emerald-600">Rs. {totalCollected.toLocaleString()}</p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Member Name</TableHead>
                  <TableHead className="font-bold text-foreground">Role</TableHead>
                  <TableHead className="font-bold text-foreground text-right">Amount Due (Today)</TableHead>
                  <TableHead className="font-bold text-foreground text-right w-[200px]">Amount Collected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheetLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Loading member dues...</TableCell>
                  </TableRow>
                ) : fields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                      {selectedGroupId ? "No loan instalments found for this week." : "Please select a group to see members."}
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => (
                    <TableRow key={field.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="font-bold flex items-center gap-2 py-4">
                        {field.fullname}
                        {field.isLeader && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                            <Crown className="w-3 h-3 mr-1" /> LEADER
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {field.isLeader ? "LEADER" : "MEMBER"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-rose-500 font-bold">
                        Rs. {Number(field.dueAmount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="relative">
                          <Input
                            type="number"
                            className="bg-background/80 h-10 text-right pr-4 font-bold border-emerald-500/20 focus:border-emerald-500"
                            {...register(`payments.${index}.amount` as const)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            size="lg" 
            disabled={createMutation.isPending || fields.length === 0}
            className="gap-2 w-full md:w-auto px-12 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 h-12 text-lg font-bold"
          >
            {createMutation.isPending ? "Processing..." : (
              <>
                <Save className="h-5 w-5" /> Submit Full Collection
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
