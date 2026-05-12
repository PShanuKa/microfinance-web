"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, Info, Landmark, Users, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreateLoanPage() {
  const router = useRouter();
  const [document, setDocument] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file.name);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Back to Loans</span>
      </div>

      <PageHeader
        title="Issue New Loan"
        description="Configure loan terms for a group, including leader and member repayment schedules."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Group & General Terms */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Group Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Select Group</Label>
                <Select>
                  <SelectTrigger className="bg-background/50 h-11">
                    <SelectValue placeholder="Choose a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g1">Sunlight Group (5 Members)</SelectItem>
                    <SelectItem value="g2">Prosperity Circle (8 Members)</SelectItem>
                    <SelectItem value="g3">Helping Hands (4 Members)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeks" className="font-semibold">Number of Weeks</Label>
                <Input id="weeks" type="number" placeholder="e.g. 50" className="bg-background/50 h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee" className="font-semibold">Processing Fee (Rs.)</Label>
                <Input id="fee" type="number" placeholder="e.g. 1000" className="bg-background/50 h-11" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Loan Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className={cn(
                 "border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative",
                 document && "bg-primary/5 border-primary/50"
               )}>
                 <input 
                   type="file" 
                   className="absolute inset-0 opacity-0 cursor-pointer" 
                   onChange={handleFileChange}
                 />
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                       <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-semibold">
                      {document ? document : "Click or drag to upload document"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</p>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Terms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leader Terms */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Badge className="bg-amber-500 hover:bg-amber-500">Group Leader</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-500" />
                Leader Terms
              </CardTitle>
              <CardDescription>Repayment configuration specifically for the group leader.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="l-amount" className="font-semibold text-foreground">Amount Lent (Rs.)</Label>
                <Input id="l-amount" type="number" placeholder="50000" className="bg-background/50 h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="l-payment" className="font-semibold text-foreground">Weekly Payment (Rs.)</Label>
                <Input id="l-payment" type="number" placeholder="1250" className="bg-background/50 h-11 border-amber-500/20" />
              </div>
            </CardContent>
          </Card>

          {/* Member Terms */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Badge className="bg-primary hover:bg-primary">All Members</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Member Terms
              </CardTitle>
              <CardDescription>Uniform repayment configuration for all other group members.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="m-amount" className="font-semibold text-foreground">Amount Lent (Rs.)</Label>
                  <Input id="m-amount" type="number" placeholder="30000" className="bg-background/50 h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-payment" className="font-semibold text-foreground">Weekly Payment (Rs.)</Label>
                  <Input id="m-payment" type="number" placeholder="750" className="bg-background/50 h-11 border-primary/20" />
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
                 <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   <strong>Note:</strong> These terms will apply to every member of the selected group except for the leader. 
                   Ensure the amounts are consistent with the group's repayment capacity.
                 </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
             <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
             <Button size="lg" className="px-10 shadow-lg shadow-primary/20 gap-2">
               <Save className="h-4 w-4" />
               Finalize & Issue Loan
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
