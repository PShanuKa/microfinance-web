"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays, isMonday, parseISO } from "date-fns";
import { AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCreateNonCollectionWeekMutation, useUpdateNonCollectionWeekMutation } from "@/services/nonCollectionWeekApi";

type FormValues = {
  startDate: string;
  endDate: string;
  reason: string;
};

interface NonCollectionWeekFormProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  isReadOnly?: boolean;
}

export function NonCollectionWeekForm({ initialData, onSuccess, onCancel, isReadOnly }: NonCollectionWeekFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const watchStartDate = watch("startDate");

  useEffect(() => {
    if (initialData) {
      reset({
        startDate: format(new Date(initialData.startDate), "yyyy-MM-dd"),
        endDate: format(new Date(initialData.endDate), "yyyy-MM-dd"),
        reason: initialData.reason || "",
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (watchStartDate && !isReadOnly) {
      const date = parseISO(watchStartDate);
      if (!isMonday(date)) {
        setDateError("Start date must be a Monday.");
        setValue("endDate", "");
      } else {
        setDateError(null);
        const end = addDays(date, 6);
        setValue("endDate", format(end, "yyyy-MM-dd"));
      }
    }
  }, [watchStartDate, setValue, isReadOnly]);

  const createMutation = useCreateNonCollectionWeekMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => setServerError(error.response?.data?.error || "Failed to save configuration"),
  });

  const updateMutation = useUpdateNonCollectionWeekMutation({
    onSuccess: () => onSuccess?.(),
    onError: (error: any) => setServerError(error.response?.data?.error || "Failed to update configuration"),
  });

  const onSubmit = (data: FormValues) => {
    if (dateError || isReadOnly) return;

    const payload = {
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      reason: data.reason,
    };

    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
      {serverError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date (Monday)</Label>
          <Input
            id="startDate"
            type="date"
            disabled={isReadOnly}
            {...register("startDate", { required: true })}
            className={cn(dateError ? "border-destructive" : "")}
          />
          {dateError && (
            <p className="text-xs text-destructive flex items-center gap-1 font-medium mt-1">
              <AlertCircle className="h-3 w-3" /> {dateError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (Sunday)</Label>
          <Input
            id="endDate"
            type="date"
            readOnly
            disabled={isReadOnly}
            {...register("endDate")}
            className="bg-muted/50 cursor-not-allowed border-dashed"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reason">Reason / Description</Label>
          <Textarea
            id="reason"
            disabled={isReadOnly}
            {...register("reason")}
            placeholder="e.g. Sinhala/Tamil New Year Holiday"
            className="min-h-[100px]"
          />
        </div>

        {!isReadOnly && watchStartDate && !dateError && (
          <div className="md:col-span-2 p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Calculated Window</span>
              <span className="text-sm font-bold text-slate-700">
                {format(parseISO(watchStartDate), "MMM d")} - {format(addDays(parseISO(watchStartDate), 6), "MMM d, yyyy")}
              </span>
            </div>
            <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold px-3 py-1 border-none text-white">Auto-Synced</Badge>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="min-w-[100px]">
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending || !!dateError}
            className="min-w-[150px]"
          >
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : initialData ? "Update Week" : "Initialize Week"}
          </Button>
        )}
      </div>
    </form>
  );
}
