"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  ShieldAlert, 
  HandCoins, 
  Settings, 
  Info, 
  HelpCircle,
  AlertCircle,
  Layers,
  CalendarDays
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="System Settings"
        description="Configure global parameters for blacklist thresholds and loan processing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blacklist Settings */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <ShieldAlert className="h-16 w-16" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
               <ShieldAlert className="h-5 w-5 text-rose-500" />
               Blacklist Settings
            </CardTitle>
            <CardDescription>Define criteria for automatic client restriction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-sm font-bold flex items-center gap-2">
                        Weeks of Late Payment
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger >
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">Number of consecutive missed weekly payments before a client is flagged for blacklist review.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                     </Label>
                     <p className="text-xs text-muted-foreground">Threshold for automatic flagging.</p>
                  </div>
                  <Input 
                    type="number" 
                    defaultValue={3} 
                    className="w-24 bg-background/50 h-11 text-center font-bold border-rose-500/20" 
                  />
               </div>
               
               <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Changing this value will affect future flagging logic. Existing blacklist records will not be altered.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Settings */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <HandCoins className="h-16 w-16" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
               <HandCoins className="h-5 w-5 text-primary" />
               Loan Settings
            </CardTitle>
            <CardDescription>Global defaults for new loan creation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                     <Label className="text-sm font-bold flex items-center gap-2">
                        Default Number of Weeks
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                     </Label>
                     <p className="text-xs text-muted-foreground">Standard duration for new loan terms.</p>
                  </div>
                  <Input 
                    type="number" 
                    defaultValue={50} 
                    className="w-24 bg-background/50 h-11 text-center font-bold" 
                  />
               </div>

               <div className="flex items-center justify-between py-4 border-t border-muted/50">
                  <div className="space-y-0.5">
                     <Label className="text-sm font-bold flex items-center gap-2">
                        Allow Parallel per Group
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                     </Label>
                     <p className="text-xs text-muted-foreground">Enable groups to have multiple active loans simultaneously.</p>
                  </div>
                  <Switch defaultChecked={false} />
               </div>

               <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Default settings help speed up the "New Loan" process by pre-filling common values.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 mt-6">
         <Button variant="ghost" size="lg">Reset to Defaults</Button>
         <Button 
           size="lg" 
           onClick={handleSave}
           disabled={loading}
           className="px-10 shadow-lg shadow-primary/20 gap-2"
         >
           <Save className="h-4 w-4" />
           {loading ? "Saving..." : "Save Settings"}
         </Button>
      </div>
    </div>
  );
}
