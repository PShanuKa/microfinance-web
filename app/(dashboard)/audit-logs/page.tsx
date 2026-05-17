"use client";

import React, { useState } from "react";
import { 
  History, 
  Eye, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  User as UserIcon,
  Activity,
  Database
} from "lucide-react";
import { PageHeader } from "@/components/Custom/PageHeader";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuditLogsQuery } from "@/services/auditApi";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MyTable from "./Table";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [entity, setEntity] = useState<string | undefined>(undefined);
  const [action, setAction] = useState<string | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAuditLogsQuery({
    page,
    limit: 20,
    entity: entity === "ALL" ? undefined : entity,
    action: action === "ALL" ? undefined : action,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination;

  const getActionBadge = (action: string) => {
    const base = "font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border-2";
    switch (action) {
      case "CREATE":
        return <Badge className={cn(base, "bg-emerald-500/10 text-emerald-600 border-emerald-500/20")}>Create</Badge>;
      case "UPDATE":
        return <Badge className={cn(base, "bg-blue-500/10 text-blue-600 border-blue-500/20")}>Update</Badge>;
      case "DELETE":
        return <Badge className={cn(base, "bg-rose-500/10 text-rose-600 border-rose-500/20")}>Delete</Badge>;
      case "APPROVE":
        return <Badge className={cn(base, "bg-amber-500/10 text-amber-600 border-amber-500/20")}>Approve</Badge>;
      case "REJECT":
        return <Badge className={cn(base, "bg-slate-500/10 text-slate-600 border-slate-500/20")}>Reject</Badge>;
      default:
        return <Badge className={cn(base, "bg-slate-100 text-slate-500 border-slate-200")}>{action}</Badge>;
    }
  };

  const openDetails = (log: any) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const renderDiff = (details: any) => {
    if (!details) return <p className="text-sm text-muted-foreground italic">No data changes recorded.</p>;

    const before = details.before || {};
    const after = details.after || {};
    const allKeys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)]));

    // Filter out internal fields if necessary
    const filteredKeys = allKeys.filter(k => !["id", "createdAt", "updatedAt", "updatedBy", "createdBy"].includes(k));

    if (filteredKeys.length === 0 && details.message) {
      return (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm font-semibold text-primary">{details.message}</p>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[150px] font-bold text-slate-600">Field</TableHead>
              <TableHead className="font-bold text-slate-600">Previous Value</TableHead>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="font-bold text-slate-600">New Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((key) => {
              const valBefore = before[key];
              const valAfter = after[key];
              const isChanged = JSON.stringify(valBefore) !== JSON.stringify(valAfter);

              return (
                <TableRow key={key} className={cn(isChanged && "bg-amber-50/30")}>
                  <TableCell className="font-bold text-slate-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-500 line-clamp-1">
                    {valBefore !== undefined && valBefore !== null ? String(valBefore) : <span className="text-slate-300 italic text-[10px]">None</span>}
                  </TableCell>
                  <TableCell>
                    {isChanged && <ArrowRight className="w-3 h-3 text-amber-500" />}
                  </TableCell>
                  <TableCell className={cn("text-sm font-bold", isChanged ? "text-slate-900" : "text-slate-500")}>
                    {valAfter !== undefined && valAfter !== null ? String(valAfter) : <span className="text-slate-300 italic text-[10px]">None</span>}
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
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader 
        title="Audit Logs" 
        description="Track system activities and data changes across the platform"
      />

      <MyTable />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by Target ID..." 
              className="pl-9 h-11 bg-slate-50 border-none focus-visible:ring-primary"
            />
          </div>
          <Select value={entity} onValueChange={(val) => setEntity(val ?? undefined)}>
            <SelectTrigger className="w-[180px] h-11 bg-slate-50 border-none">
              <SelectValue placeholder="Module (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Modules</SelectItem>
              <SelectItem value="CLIENT">Client</SelectItem>
              <SelectItem value="GROUP">Group</SelectItem>
              <SelectItem value="LOAN">Loan</SelectItem>
              <SelectItem value="COLLECTION">Collection</SelectItem>
              <SelectItem value="SETTINGS">Settings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={action} onValueChange={(val) => setAction(val ?? undefined)}>
            <SelectTrigger className="w-[150px] h-11 bg-slate-50 border-none">
              <SelectValue placeholder="Action (All)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="APPROVE">Approve</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-slate-50 hover:bg-primary/10 hover:text-primary transition-all">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                <TableHead className="font-bold text-foreground py-5 pl-6">Timestamp</TableHead>
                <TableHead className="font-bold text-foreground">User (Actor)</TableHead>
                <TableHead className="font-bold text-foreground text-center">Action</TableHead>
                <TableHead className="font-bold text-foreground">Module</TableHead>
                <TableHead className="font-bold text-foreground">Target ID</TableHead>
                <TableHead className="font-bold text-foreground">Details</TableHead>
                <TableHead className="font-bold text-foreground text-center pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={7} className="h-16 bg-slate-50/50 mb-2 border-none" />
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center text-muted-foreground font-medium">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log: any) => (
                  <TableRow key={log.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell className="py-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{format(new Date(log.createdAt), "yyyy-MM-dd")}</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">{format(new Date(log.createdAt), "hh:mm:ss a")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                          <UserIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900 leading-none mb-1">{log.user?.fullname}</span>
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider bg-slate-100 px-1.5 py-0.5 rounded leading-none w-fit">
                            {log.user?.role?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getActionBadge(log.action)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold text-[10px] uppercase">
                        {log.entity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                        {log.entityId}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-sm text-slate-600 truncate font-medium">
                        {log.details?.message || `Performed ${log.action.toLowerCase()} on ${log.entity.toLowerCase()}`}
                      </p>
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm border"
                        onClick={() => openDetails(log)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-xl border-slate-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1 mx-4">
            <span className="text-sm font-bold text-slate-900">Page {page}</span>
            <span className="text-sm text-slate-400">of {pagination.totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={page === pagination.totalPages}
            className="rounded-xl border-slate-200"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Activity Details</DialogTitle>
              {selectedLog && getActionBadge(selectedLog.action)}
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4 border-b pb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Performed By</span>
                <span className="font-semibold text-foreground">{selectedLog?.user?.fullname}</span>
                <span className="text-xs text-muted-foreground capitalize">{selectedLog?.user?.role?.toLowerCase().replace(/_/g, " ")}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Execution Time</span>
                <span className="font-semibold text-foreground">
                  {selectedLog && format(new Date(selectedLog.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </span>
                <span className="text-xs text-muted-foreground italic">Log ID: {selectedLog?.id}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Data Modifications</h3>
              {selectedLog && renderDiff(selectedLog.details)}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              onClick={() => setIsModalOpen(false)} 
              variant="outline"
              className="px-6 font-bold"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
