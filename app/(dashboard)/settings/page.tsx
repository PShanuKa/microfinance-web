"use client";

import React, { useState, useEffect } from "react";
import { CommonButton } from "@/components/common/Button";
import { 
  Save, 
  ShieldAlert, 
  HandCoins, 
  Settings, 
  Info, 
  HelpCircle,
  AlertCircle,
  Layers,
  CalendarDays,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsQuery, useUpdateSettingsMutation } from "@/services/settingsApi";
import { useForm } from "react-hook-form";
import { useDialogStore } from "@/store/useDialogStore";

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();
  const { setOpen } = useDialogStore();
  
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    if (settingsData?.settings) {
      reset(settingsData.settings);
    }
  }, [settingsData, reset]);

  const onFormSubmit = (data: any) => {
    // Ensure numbers are sent as numbers
    const payload = {
      ...data,
      lateWeeksFlag: Number(data.lateWeeksFlag),
      minLoanWeeks: Number(data.minLoanWeeks),
      maxLoanWeeks: Number(data.maxLoanWeeks),
      defaultLoanWeeks: Number(data.defaultLoanWeeks),
      maxActiveLoansGroup: Number(data.maxActiveLoansGroup),
    };
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setOpen({
          open: true,
          type: "success",
          title: "Configuration Saved",
          message: "System settings have been successfully updated.",
        });
      },
      onError: (err: any) => {
        setOpen({
          open: true,
          type: "error",
          title: "Update Failed",
          message: err?.response?.data?.error || "Failed to save configurations. Please try again.",
        });
      }
    });
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse font-bold text-primary">Loading System Configurations...</div>;

  const currentMaxActive = watch("maxActiveLoansGroup");

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <PageHeader
        title="System Settings"
        description="Global configurations for risk management, loan parameters, and operational constraints."
      />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blacklist Settings */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-rose-500/50">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <ShieldAlert className="h-16 w-16" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                 <ShieldAlert className="h-5 w-5 text-rose-500" />
                 Risk & Blacklist Settings
              </CardTitle>
              <CardDescription>Automatic flagging criteria for late payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[70%]">
                       <Label className="text-sm font-bold flex items-center gap-2">
                          Weeks of Late Payment
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger type="button">
                                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-xs">Number of consecutive missed weekly payments before a client is flagged for blacklist review.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                       </Label>
                       <p className="text-xs text-muted-foreground">Threshold for automatic system flagging.</p>
                    </div>
                    <Input 
                      type="number" 
                      {...register("lateWeeksFlag")}
                      className="w-24 bg-background/50 h-11 text-center font-black border-rose-500/20 text-lg" 
                    />
                 </div>
                 
                 <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Increasing this threshold reduces strictness, while decreasing it makes the system more aggressive in identifying delinquent borrowers.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Duration Settings */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-primary/50">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <CalendarDays className="h-16 w-16" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                 <CalendarDays className="h-5 w-5 text-primary" />
                 Loan Duration Boundaries
              </CardTitle>
              <CardDescription>Configure minimum and maximum repayment weeks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Min Weeks</Label>
                    <Input 
                      type="number" 
                      {...register("minLoanWeeks")}
                      className="bg-background/50 h-11 text-center font-black text-lg" 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-muted-foreground tracking-widest">Max Weeks</Label>
                    <Input 
                      type="number" 
                      {...register("maxLoanWeeks")}
                      className="bg-background/50 h-11 text-center font-black text-lg" 
                    />
                 </div>
              </div>
              
              <div className="pt-4 border-t border-muted/50">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-sm font-bold">Default Loan Duration</Label>
                       <p className="text-xs text-muted-foreground">Pre-filled value in New Loan form.</p>
                    </div>
                    <Input 
                      type="number" 
                      {...register("defaultLoanWeeks")}
                      className="w-24 bg-background/50 h-11 text-center font-black text-lg" 
                    />
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Group Constraints */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-amber-500/50">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Layers className="h-16 w-16" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                 <Layers className="h-5 w-5 text-amber-500" />
                 Group Loan Constraints
              </CardTitle>
              <CardDescription>Operational limits per borrowing group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5 max-w-[70%]">
                       <Label className="text-sm font-bold">Max Active Loans per Group</Label>
                       <p className="text-xs text-muted-foreground">Maximum number of concurrent loans a single group can hold.</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <Input 
                        type="number" 
                        {...register("maxActiveLoansGroup")}
                        className="w-20 bg-background/50 h-11 text-center font-black text-lg" 
                       />
                    </div>
                 </div>

                 <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Setting this to <strong>1</strong> (recommended) prevents debt cycles within groups. 
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6">
           <CommonButton 
              type="button" 
              variant="ghost" 
              size="lg" 
              onClick={() => reset(settingsData?.settings)} 
              className="font-bold"
              leftIcon={<RefreshCcw className="h-4 w-4 mr-2" />}
           >
              Reset
           </CommonButton>
           <CommonButton 
             type="submit"
             size="lg" 
             isLoading={updateMutation.isPending}
             
             leftIcon={<Save className="h-5 w-5" />}
           >
             Save Configuration
           </CommonButton>
        </div>
      </form>
    </div>
  );
}
