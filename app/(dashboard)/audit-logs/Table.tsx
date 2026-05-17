import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreVertical, History, ArrowRight, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useAuditLogsQuery } from "@/services/auditApi";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TablePagination from "@/components/Custom/TablePagination";

const TableAuditLogs = ({ id }: { id?: string }) => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("All");
  const [entityFilter, setEntityFilter] = useState("All");
  
  const { data, isLoading } = useAuditLogsQuery({
    page: 1,
    limit: 200,
    ...(id && { entityId: id }),
    ...(actionFilter !== "All" && { action: actionFilter }),
    ...(entityFilter !== "All" && { entity: entityFilter }),
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onClose = () => {
    setIsOpen(false);
    setSelectedLog(null);
  };

  const updateFilters = (updates: any) => {
    if (updates.action !== undefined) setActionFilter(updates.action);
    if (updates.entity !== undefined) setEntityFilter(updates.entity);
    setPage(1);
  };

  const filteredLogs = data?.logs?.filter((log: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.user?.fullname?.toLowerCase().includes(term) ||
      log.entityId?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.details?.message?.toLowerCase().includes(term)
    );
  }) || [];

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <AuditDetailsModal isOpen={isOpen} onClose={onClose} log={selectedLog} />
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent>
          <div>
            {!id && (
              <>
                <div className="flex flex-col md:flex-row items-center p-4 border-b bg-muted/20 gap-4">
                  <div className="relative flex-1 w-[80px] md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by User, Target ID, or Action..."
                      className="pl-10 h-10 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <div
                    className="flex items-center gap-3 w-full md:w-auto cursor-pointer"
                    onClick={() =>
                      setOpenItem((prev) => (prev.includes("item-1") ? [] : ["item-1"]))
                    }
                  >
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border hover:bg-muted/50 transition-colors">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Filters</span>
                    </div>
                  </div>
                </div>

                <Accordion
                  value={openItem}
                  onValueChange={setOpenItem}
                  className="w-full border-none"
                >
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionContent className="px-4 py-4 border-b bg-muted/20">
                      <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex flex-col gap-1.5 w-full md:w-auto">
                          <Label className="text-xs text-muted-foreground ml-1">Module (Entity)</Label>
                          <Select
                            value={entityFilter}
                            onValueChange={(val) => updateFilters({ entity: val || "All" })}
                          >
                            <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                              <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="All Modules" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Modules</SelectItem>
                              <SelectItem value="CLIENT">Client</SelectItem>
                              <SelectItem value="GROUP">Group</SelectItem>
                              <SelectItem value="LOAN">Loan</SelectItem>
                              <SelectItem value="SETTINGS">Settings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col gap-1.5 w-full md:w-auto">
                          <Label className="text-xs text-muted-foreground ml-1">Action</Label>
                          <Select
                            value={actionFilter}
                            onValueChange={(val) => updateFilters({ action: val || "All" })}
                          >
                            <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                              <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="All Actions" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Actions</SelectItem>
                              <SelectItem value="CREATE">Create</SelectItem>
                              <SelectItem value="UPDATE">Update</SelectItem>
                              <SelectItem value="DELETE">Delete</SelectItem>
                              <SelectItem value="APPROVE">Approve</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(actionFilter !== "All" || entityFilter !== "All") && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateFilters({ action: "All", entity: "All" })}
                            className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                    <TableHead className="font-bold text-foreground">
                      Timestamp
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      User
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Action
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Module & Target
                    </TableHead>
                    <TableHead className="font-bold text-foreground">
                      Details
                    </TableHead>
                    <TableHead className="text-right font-bold text-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Loading audit logs...
                      </TableCell>
                    </TableRow>
                  ) : paginatedLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        No audit logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedLogs.map((log: any) => (
                      <TableRow
                        key={log.id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary/20 transition-colors">
                              <History className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">
                                {format(new Date(log.createdAt), "yyyy-MM-dd")}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(log.createdAt), "hh:mm a")}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">
                                {log.user?.fullname || "System"}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider">
                                {log.user?.role?.replace(/_/g, " ") || "N/A"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge
                              variant="outline"
                              className="font-bold text-[10px] uppercase"
                            >
                              {log.action?.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700">
                                {log.entity}
                              </span>
                              <span className="text-xs font-mono">
                                {log.entityId}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground line-clamp-2 max-w-[250px]">
                            {log.details?.message ||
                              `Performed ${log.action?.toLowerCase().replace(/_/g, " ")} on ${log.entity?.toLowerCase()}`}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                                <MoreVertical className="h-4 w-4" />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 bg-card/95 backdrop-blur-md"
                            >
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                  Audit Actions
                                </DropdownMenuLabel>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedLog(log);
                                  setIsOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 text-primary" /> View
                                Full Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TableAuditLogs;

const AuditDetailsModal = ({
  isOpen,
  onClose,
  log,
}: {
  isOpen: boolean;
  onClose: () => void;
  log: any;
}) => {
  if (!isOpen || !log) return null;

  const getActionBadge = (action: string) => {
    const base =
      "font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border-2";
    switch (action) {
      case "LOAN_CREATE":
      case "CREATE":
        return (
          <Badge
            className={`${base} bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none`}
          >
            Create
          </Badge>
        );
      case "LOAN_SCHEDULE_UPDATE":
      case "LOAN_GUARANTOR_UPDATE":
      case "UPDATE":
        return (
          <Badge
            className={`${base} bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none`}
          >
            Update
          </Badge>
        );
      case "LOAN_GUARANTOR_DELETE":
      case "DELETE":
        return (
          <Badge
            className={`${base} bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-none`}
          >
            Delete
          </Badge>
        );
      case "LOAN_APPROVE":
      case "APPROVE":
        return (
          <Badge
            className={`${base} bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-none`}
          >
            Approve
          </Badge>
        );
      case "LOAN_REJECT":
      case "REJECT":
        return (
          <Badge
            className={`${base} bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-none`}
          >
            Reject
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${base} bg-slate-100 text-slate-500 border-slate-200 shadow-none`}
          >
            {action?.replace(/_/g, " ")}
          </Badge>
        );
    }
  };

  const renderDiff = (details: any) => {
    if (!details)
      return (
        <p className="text-sm text-muted-foreground italic">
          No data changes recorded.
        </p>
      );

    const before = details.before || {};
    const after = details.after || {};
    const allKeys = Array.from(
      new Set([...Object.keys(before), ...Object.keys(after)]),
    );

    const filteredKeys = allKeys.filter(
      (k) =>
        !["id", "createdAt", "updatedAt", "updatedBy", "createdBy"].includes(k),
    );

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
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[150px] font-bold text-slate-600 h-9">
                Field
              </TableHead>
              <TableHead className="font-bold text-slate-600 h-9">
                Previous
              </TableHead>
              <TableHead className="w-[40px] h-9"></TableHead>
              <TableHead className="font-bold text-slate-600 h-9">
                New
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((key) => {
              const valBefore = before[key];
              const valAfter = after[key];
              const isChanged =
                JSON.stringify(valBefore) !== JSON.stringify(valAfter);

              return (
                <TableRow
                  key={key}
                  className={`${isChanged ? "bg-amber-50/30" : ""} h-10 hover:bg-muted/50`}
                >
                  <TableCell className="font-bold text-slate-900 capitalize py-2">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500 py-2">
                    {valBefore !== undefined && valBefore !== null
                      ? String(valBefore)
                      : "-"}
                  </TableCell>
                  <TableCell className="py-2">
                    {isChanged && (
                      <ArrowRight className="w-3 h-3 text-amber-500" />
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-xs font-bold py-2 ${isChanged ? "text-slate-900" : "text-slate-500"}`}
                  >
                    {valAfter !== undefined && valAfter !== null
                      ? String(valAfter)
                      : "-"}
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-2xl font-bold">
              Activity Details
            </DialogTitle>
            {log && getActionBadge(log.action)}
          </div>
          <DialogDescription>
            Detailed view of the performed action and data modifications.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Performed By
              </p>
              <p className="font-bold text-slate-900">
                {log?.user?.fullname || "System"}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {log?.user?.role?.replace(/_/g, " ") || "N/A"}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Execution Time
              </p>
              <p className="font-bold text-slate-900">
                {log && format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </p>
              <p className="text-[10px] font-bold text-primary font-mono">
                {log?.id}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Data Modifications
            </p>
            {log && renderDiff(log.details)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
