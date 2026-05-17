"use client"

import { useCreateCollectionMutation, useDailyRegistryQuery } from "@/services/collectionApi";
import { useUploadAttachmentMutation, useDeleteAttachmentMutation } from "@/services/attachmentApi";
import { Input } from "@/components/ui/input";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Banknote, CheckCircle2, MapPin, Phone, Plus, Receipt, Users, Wallet, UploadCloud, Trash2, Paperclip, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { toast } from "sonner"; 

export default function RegistryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const loanId = params.loanId as string;
  const date = searchParams.get("date") || "2026-06-07";

  const [isRecording, setIsRecording] = React.useState(false);
  const [collectedAmounts, setCollectedAmounts] = React.useState<Record<string, string>>({});
  const [attachments, setAttachments] = React.useState<{ attachmentId: string; note: string; fileName: string; fileUrl: string }[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);

  const { data, isLoading } = useDailyRegistryQuery({ loanId, date });

  const uploadMutation = useUploadAttachmentMutation();
  const deleteMutation = useDeleteAttachmentMutation();

  const createCollection = useCreateCollectionMutation({
    onSuccess: () => {
      alert("Collection created successfully!");
      setIsRecording(false);
      setAttachments([]);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to save collection.");
    }
  });

  const registryInfo = data?.registry?.[0];
  const instalments = data?.instalments || [];

  // Initialize collected amounts when entering recording mode
  React.useEffect(() => {
    if (isRecording && instalments.length > 0) {
      const initial: Record<string, string> = {};
      instalments.forEach((inst: any) => {
        initial[inst.id] = inst.dueAmount.toString();
      });
      setCollectedAmounts(initial);
    }
  }, [isRecording, instalments]);

  const handleAmountChange = (id: string, val: string) => {
    setCollectedAmounts(prev => ({ ...prev, [id]: val }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadMutation.mutateAsync(file);
        if (res?.success) {
          setAttachments(prev => [
            ...prev,
            {
              attachmentId: res.id,
              note: "",
              fileName: file.name,
              fileUrl: res.link
            }
          ]);
        }
      }
    } catch (error) {
      alert("Failed to upload file(s).");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAttachment = async (id: string, index: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setAttachments(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNoteChange = (index: number, note: string) => {
    setAttachments(prev => {
      const copy = [...prev];
      copy[index].note = note;
      return copy;
    });
  };

  const handleSaveCollection = () => {
    const breakdown = instalments.map((inst: any) => ({
      instalmentId: inst.id,
      amount: parseFloat(collectedAmounts[inst.id] || "0"),
      memberName: inst.memberName
    }));

    const payload = {
      groupId: registryInfo.groupId,
      loanId: registryInfo.loanId,
      date: new Date(date).toISOString(),
      instalmentNumber: registryInfo.instalmentNo,
      collectorId: "SYSTEM", 
      breakdownData: breakdown,
      attachments: attachments.map(att => ({
        attachmentId: att.attachmentId,
        note: att.note
      }))
    };

    createCollection.mutate(payload);
  };

  const totalCollectedNow = Object.values(collectedAmounts).reduce((sum, val) => sum + parseFloat(val || "0"), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-xs">
          Loading Registry Details...
        </div>
      </div>
    );
  }

  if (!registryInfo && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
          Registry Not Found for this date.
        </p>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Registry Details</h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Collection Date: {date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRecording ? (
            <>
              <Button variant="outline" onClick={() => setIsRecording(false)} className="font-bold">Cancel</Button>
              <Button 
                onClick={handleSaveCollection} 
                className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 text-white"
                disabled={createCollection.isPending}
              >
                {createCollection.isPending ? "Saving..." : <><CheckCircle2 className="h-4 w-4" /> Save Collection</>}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsRecording(true)} 
              className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-bold"
            >
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Info Card */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Users className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight">{registryInfo.groupName}</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  Group ID: {registryInfo.groupNo}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Location / Center</span>
                  <span className="text-sm font-bold">{registryInfo.location} - {registryInfo.center}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Leader Details</span>
                  <span className="text-sm font-bold">{registryInfo.leader}</span>
                  <span className="text-xs text-primary font-black uppercase tracking-tighter">{registryInfo.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary Card */}
        <Card className="border-none shadow-xl bg-primary text-primary-foreground relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Expected Today</p>
                <p className="text-2xl font-black mt-1">Rs. {registryInfo.expected.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">Week Number</p>
                <p className="text-2xl font-black mt-1">#{registryInfo.instalmentNo}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black uppercase opacity-60">Loan Number</p>
                <p className="text-lg font-black mt-1 tracking-widest opacity-90">{registryInfo.loanNo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Status Card */}
        <Card className={cn(
          "border-none shadow-xl relative overflow-hidden group text-white",
          registryInfo.status === "Verified" ? "bg-emerald-600" : "bg-amber-600"
        )}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Banknote className="h-16 w-16" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4">
              {isRecording ? "Recording Progress" : "Collection Progress"}
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black uppercase opacity-60">
                  {isRecording ? "New Collected Total" : "Collected Amount"}
                </p>
                <p className="text-2xl font-black mt-1">
                  Rs. {(isRecording ? totalCollectedNow : registryInfo.collected).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000" 
                      style={{ width: `${((isRecording ? totalCollectedNow : registryInfo.collected) / registryInfo.expected) * 100}%` }}
                    />
                 </div>
                 <span className="text-xs font-black">
                   {Math.round(((isRecording ? totalCollectedNow : registryInfo.collected) / registryInfo.expected) * 100)}%
                 </span>
              </div>
              <Badge className="w-fit bg-white/20 border-none text-[10px] font-black uppercase">
                Status: {isRecording ? "In Progress" : registryInfo.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member-wise Instalments Table */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Member-wise Breakdown
          </h3>
          <Badge variant="outline" className="font-bold">{instalments.length} Members</Badge>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="font-bold text-foreground">Member Details</TableHead>
                <TableHead className="font-bold text-foreground text-center">Week</TableHead>
                <TableHead className="font-bold text-foreground text-right">Due Amount</TableHead>
                <TableHead className="font-bold text-foreground text-right">
                  {isRecording ? "Record Collection" : "Paid Amount"}
                </TableHead>
                <TableHead className="font-bold text-foreground text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instalments.map((inst: any) => (
                <TableRow key={inst.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">{inst.memberName}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{inst.clientNo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-500">#{inst.weekNumber}</TableCell>
                  <TableCell className="text-right font-black text-slate-700">Rs. {inst.dueAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-black text-emerald-600 w-48">
                    {isRecording ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-muted-foreground opacity-50">Rs.</span>
                        <Input
                          type="number"
                          className="h-8 w-28 text-right font-black"
                          value={collectedAmounts[inst.id] || ""}
                          onChange={(e) => handleAmountChange(inst.id, e.target.value)}
                        />
                      </div>
                    ) : (
                      `Rs. ${inst.paidAmount.toLocaleString()}`
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "font-bold text-[10px] uppercase px-2 py-0.5 border-none text-white",
                      inst.status === "PAID" ? "bg-emerald-500" : 
                      inst.status === "PARTIAL" ? "bg-amber-500" : 
                      inst.status === "Pending" ? "bg-blue-500" : "bg-slate-400"
                    )}>
                      {inst.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isRecording && (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-primary" />
              Collection Attachments & Verification Documents
            </h3>
            <Badge variant="outline" className="font-bold">{attachments.length} Files</Badge>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-all relative group">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors mb-3" />
              <p className="text-sm font-bold text-slate-700">Click or drag files here to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Upload multiple documents, deposit slips, or images</p>
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="font-bold text-xs uppercase tracking-widest text-slate-700">Uploading File(s)...</span>
                </div>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Uploaded Documents</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attachments.map((att, index) => (
                    <div key={att.attachmentId} className="flex flex-col border rounded-2xl p-3 bg-white shadow-sm relative group">
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(att.attachmentId, index)}
                        className="absolute top-2 right-2 p-1.5 bg-rose-50 hover:bg-rose-100 rounded-full text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-xl">
                          <Paperclip className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <p className="text-xs font-bold text-slate-800 truncate">{att.fileName}</p>
                          <a href={att.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary font-semibold hover:underline">
                            View file
                          </a>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Input
                          placeholder="Add note or description (e.g. Member slip)"
                          className="h-8 text-xs font-medium"
                          value={att.note}
                          onChange={(e) => handleNoteChange(index, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
