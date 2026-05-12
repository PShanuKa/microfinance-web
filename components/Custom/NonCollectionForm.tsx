"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
  reason: z.string().min(5, { message: "Reason must be at least 5 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

interface NonCollectionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NonCollectionForm({ onSuccess, onCancel }: NonCollectionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Non-Collection Week Data:", data);
    alert("Non-Collection Week Added Successfully!");
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="font-semibold text-sm">Start Date</Label>
          <div className="relative">
             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input id="startDate" type="date" className="bg-background/50 h-11 pl-10" {...register("startDate")} />
          </div>
          {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="font-semibold text-sm">End Date</Label>
          <div className="relative">
             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input id="endDate" type="date" className="bg-background/50 h-11 pl-10" {...register("endDate")} />
          </div>
          {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="reason" className="font-semibold text-sm">Reason for Non-Collection</Label>
          <Textarea 
            id="reason" 
            placeholder="e.g. Sinhala & Hindu New Year Holidays, Public Strike, etc." 
            className="bg-background/50 min-h-[100px]" 
            {...register("reason")}
          />
          {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="w-40 shadow-lg shadow-primary/20">Add Schedule</Button>
      </div>
    </form>
  );
}
