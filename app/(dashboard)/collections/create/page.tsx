"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Users, 
  Calendar as CalendarIcon, 
  CreditCard, 
  FileText, 
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function CreateCollectionPage() {
  const router = useRouter();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);

  // Mock members for the selected group
  const members = [
    { id: "C-001", name: "Anura Kumara", due: 1250 },
    { id: "C-002", name: "Sunil Perera", due: 750 },
    { id: "C-004", name: "Kamal Gunarathne", due: 750 },
    { id: "C-005", name: "Saman Kumara", due: 1000 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachments([...attachments, file.name]);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Back to Collections</span>
      </div>

      <PageHeader
        title="New Group Collection"
        description="Record weekly repayments for a group and document the bank deposit."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Header Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Users className="h-5 w-5 text-primary" />
                 Collection Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Select Group</Label>
                <Select onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-background/50 h-11">
                    <SelectValue placeholder="Choose group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g1">Sunlight Group</SelectItem>
                    <SelectItem value="g2">Prosperity Circle</SelectItem>
                    <SelectItem value="g3">Helping Hands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="font-semibold">Collection Date</Label>
                <div className="relative">
                   <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input id="date" type="date" className="bg-background/50 h-11 pl-10" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankRef" className="font-semibold">Bank Deposit Ref (Slip No)</Label>
                <div className="relative">
                   <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input id="bankRef" placeholder="e.g. DEP-12345" className="bg-background/50 h-11 pl-10 border-primary/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader>
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes & Attachments
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="notes" className="font-semibold">Breakdown Notes</Label>
                  <Textarea id="notes" placeholder="Any specific notes about this collection..." className="bg-background/50 min-h-[100px]" />
               </div>
               
               <div className="space-y-2">
                  <Label className="font-semibold">Deposit Slip / Attachments</Label>
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 text-center hover:border-primary/50 transition-colors relative cursor-pointer">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                     <div className="flex flex-col items-center gap-1">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-bold">Upload Image</span>
                     </div>
                  </div>
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                       {attachments.map((file, i) => (
                         <div key={i} className="flex items-center justify-between p-2 rounded bg-primary/5 border border-primary/10 text-[10px] font-bold">
                            <span className="truncate max-w-[150px]">{file}</span>
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Collection Table */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Users className="h-5 w-5 text-primary" />
                 Member Repayments
              </CardTitle>
              <CardDescription>
                {selectedGroup ? "Enter the collected amount for each member of the group." : "Please select a group to load member list."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedGroup ? (
                <div className="rounded-xl border border-muted/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-bold">Member Name</TableHead>
                        <TableHead className="font-bold">Weekly Due</TableHead>
                        <TableHead className="font-bold">Collected Amount (Rs.)</TableHead>
                        <TableHead className="text-right font-bold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell>
                            <div className="flex flex-col">
                               <span className="font-bold">{member.name}</span>
                               <span className="text-[10px] text-muted-foreground uppercase">{member.id}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-muted-foreground">Rs. {member.due.toLocaleString()}</TableCell>
                          <TableCell className="w-[200px]">
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Rs.</span>
                               <Input 
                                 type="number" 
                                 defaultValue={member.due} 
                                 className="pl-9 bg-background/50 h-9 font-black text-emerald-600 border-emerald-500/20 focus:ring-emerald-500/20" 
                               />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                             <Badge className="bg-emerald-500 text-[10px] font-bold">Full Paid</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-3">
                   <div className="p-4 rounded-full bg-muted">
                      <AlertCircle className="h-8 w-8 opacity-20" />
                   </div>
                   <p className="text-sm font-medium italic">Select a group from the left panel to start collecting...</p>
                </div>
              )}

              {selectedGroup && (
                <div className="mt-8 flex flex-col items-end gap-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                   <div className="flex justify-between w-full md:w-64">
                      <span className="text-sm font-bold text-muted-foreground">Total Collected:</span>
                      <span className="text-xl font-black text-primary">Rs. 3,750</span>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                      <Button size="lg" className="px-10 shadow-lg shadow-primary/20 gap-2">
                         <Save className="h-4 w-4" />
                         Post Collection
                      </Button>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
