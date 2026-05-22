"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Eye, 
  User as UserIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  History
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useAuditLogsQuery } from "@/services/auditApi";
import { cn } from "@/lib/utils";

interface AuditHistoryProps {
  entity: string;
  entityId: string;
}

export function AuditHistory({ entity, entityId }: AuditHistoryProps) {
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAuditLogsQuery({
    page,
    limit: 10,
    entity,
    entityId,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  const getActionBadge = (action: string) => {
    const base = "font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border-2";
    switch (action) {
      case "LOAN_CREATE":
      case "CREATE":
        return <Badge className={cn(base, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none")}>Create</Badge>;
      case "LOAN_SCHEDULE_UPDATE":
      case "LOAN_GUARANTOR_UPDATE":
      case "UPDATE":
        return <Badge className={cn(base, "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none")}>Update</Badge>;
      case "LOAN_GUARANTOR_DELETE":
      case "DELETE":
        return <Badge className={cn(base, "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-none")}>Delete</Badge>;
      case "LOAN_APPROVE":
      case "APPROVE":
        return <Badge className={cn(base, "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none")}>Approve</Badge>;
      case "LOAN_REJECT":
      case "REJECT":
        return <Badge className={cn(base, "bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-none")}>Reject</Badge>;
      default:
        return <Badge className={cn(base, "bg-slate-100 text-slate-500 border-slate-200 shadow-none")}>{action.replace(/_/g, " ")}</Badge>;
    }
  };

  const renderDiff = (details: any) => {
    if (!details) return <p className="text-sm text-muted-foreground italic">No data changes recorded.</p>;

    const before = details.before || {};
    const after = details.after || {};
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));

    const filteredKeys = allKeys.filter(k => !["id", "createdAt", "updatedAt", "updatedBy", "createdBy"].includes(k));

    if (filteredKeys.length === 0) {
      return (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <pre className="text-[10px] font-mono text-primary whitespace-pre-wrap">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[150px] font-bold text-slate-600 h-9">Field</TableHead>
              <TableHead className="font-bold text-slate-600 h-9">Previous</TableHead>
              <TableHead className="w-[40px] h-9"></TableHead>
              <TableHead className="font-bold text-slate-600 h-9">New</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((key) => {
              const valBefore = before[key];
              const valAfter = after[key];
              const isChanged = JSON.stringify(valBefore) !== JSON.stringify(valAfter);

              return (
                <TableRow key={key} className={cn(isChanged && "bg-amber-50/30", "h-10")}>
                  <TableCell className="font-bold text-slate-900 capitalize py-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500 py-2">
                    {valBefore !== undefined && valBefore !== null ? String(valBefore) : "-"}
                  </TableCell>
                  <TableCell className="py-2">
                    {isChanged && <ArrowRight className="w-3 h-3 text-amber-500" />}
                  </TableCell>
                  <TableCell className={cn("text-xs font-bold py-2", isChanged ? "text-slate-900" : "text-slate-500")}>
                    {valAfter !== undefined && valAfter !== null ? String(valAfter) : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
         <History className="w-4 h-4 text-primary" />
         <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Audit Trail</h3>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100/50 hover:bg-slate-100/50 border-b">
              <TableHead className="font-bold text-slate-700 h-12 pl-6">Timestamp</TableHead>
              <TableHead className="font-bold text-slate-700 h-12">User</TableHead>
              <TableHead className="font-bold text-slate-700 h-12 text-center">Action</TableHead>
              <TableHead className="font-bold text-slate-700 h-12">Description</TableHead>
              <TableHead className="w-[60px] h-12 pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={5} className="h-16 bg-slate-50/50" />
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <History className="w-8 h-8 opacity-20" />
                    <p className="font-bold text-sm">No history found for this record.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: any) => (
                <TableRow key={log.id} className="hover:bg-primary/5 transition-colors border-b last:border-0 group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-xs">{format(new Date(log.createdAt), "yyyy-MM-dd")}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{format(new Date(log.createdAt), "hh:mm:ss a")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                        <UserIcon className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 leading-none mb-1">{log.user?.fullname}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.user?.role?.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-slate-600 font-bold truncate max-w-[200px]">
                      {log.details?.message || `Performed ${log.action.toLowerCase().replace(/_/g, " ")}`}
                    </p>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-all border"
                      onClick={() => {
                        setSelectedLog(log);
                        setIsModalOpen(true);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg">
            <span className="text-[10px] font-black text-slate-900">{page}</span>
            <span className="text-[10px] font-bold text-slate-400">/</span>
            <span className="text-[10px] font-bold text-slate-400">{pagination.totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="h-8 w-8 p-0 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-black tracking-tighter uppercase">History Detail</DialogTitle>
              {selectedLog && getActionBadge(selectedLog.action)}
            </div>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Performed By</p>
                <p className="font-bold text-slate-900">{selectedLog?.user?.fullname}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{selectedLog?.user?.role?.replace(/_/g, " ")}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Execution Time</p>
                <p className="font-bold text-slate-900">{selectedLog && format(new Date(selectedLog.createdAt), "yyyy-MM-dd HH:mm:ss")}</p>
                <p className="text-[10px] font-bold text-primary font-mono">{selectedLog?.id}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data Change Manifest</p>
              {selectedLog && renderDiff(selectedLog.details)}
            </div>
          </div>
          <div className="flex justify-end pt-2">
             <Button variant="outline" className="rounded-xl font-bold px-8" onClick={() => setIsModalOpen(false)}>Close Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
