"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Plus,
  Search,
  UserPen,
  Eye,
  CreditCard,
  Phone,
  Briefcase,
  Clock,
  Filter,
  User2,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClientsQuery, useDeleteClientMutation } from "@/services/clientApi";
import { ClientForm } from "@/components/Custom/ClientForm";
import { cn } from "@/lib/utils";
import TablePagination from "@/components/Custom/TablePagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { RoleGate } from "@/components/Custom/RoleGate";
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";

export default function ClientsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // URL synced filters
  const statusFilter = searchParams.get("status") || "All";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Function to update URL params
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
    setPage(1);
  };

  const { data, isLoading } = useClientsQuery({
    page,
    limit: 10,
    search,
    status: statusFilter,
    startDate,
    endDate,
  });
  const deleteMutation = useDeleteClientMutation({
    onSuccess: () => {
      setDeleteConfirmId(null);
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.error ||
          "Failed to delete client. They might have active loans or group associations.",
      );
      setDeleteConfirmId(null);
    },
  });

  const handleEdit = (client: any) => {
    router.push(`/clients/${client.id}/edit`);
  };

  const handleView = (client: any) => {
    router.push(`/clients/${client.id}`);
  };

  const handleCreate = () => {
    router.push("/clients/new");
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-emerald-500 hover:bg-emerald-600",
      INACTIVE: "bg-amber-500 hover:bg-amber-600",
      BLACKLISTED: "bg-rose-500 hover:bg-rose-600",
    };

    return (
      <Badge
        className={cn(
          "border-none px-3 py-1 rounded-full font-bold text-white",
          colors[status] || "bg-slate-500",
        )}
      >
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {status}
        </div>
      </Badge>
    );
  };

  const highlightText = (text: string, term: string) => {
    if (!term || !text) return text;
    const parts = text.toString().split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-black rounded-sm px-0.5">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Clients"
        description="Manage client profiles, contact information, and registration status"
      >
        <RoleGate allowedRoles={["LOAN_OFFICER", "MORTGAGE_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>
        <Button
          onClick={handleCreate}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
          <Plus className="h-4 w-4" />
          New Client
        </Button>
          </RoleGate>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <SearchFilterPanel
            searchTerm={search}
            onSearchChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            searchPlaceholder="Search by name, ID, or NIC..."
          >
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => updateFilters({ status: val || "All" })}
                >
                  <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Filter Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="BLACKLISTED">Blacklisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Start Date</Label>
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                  className="w-full md:w-[180px] h-10 bg-background/50"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">End Date</Label>
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => updateFilters({ endDate: e.target.value })}
                  className="w-full md:w-[180px] h-10 bg-background/50"
                />
              </div>
              
              {(startDate || endDate) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters({ startDate: "", endDate: "" })}
                  className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                >
                  Clear Dates
                </Button>
              )}
            </div>
          </SearchFilterPanel>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">
                    Client Details
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    NIC Number
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Phone
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Job / Occupation
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : data?.clients?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.clients?.map((client: any) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary/20 transition-colors">
                            {client.profileImage?.fileUrl ? (
                              <img
                                src={client.profileImage.fileUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User2 className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {highlightText(client.fullname, search)}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {highlightText(client.clientNo, search)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <CreditCard className="h-3.5 w-3.5" />
                          {highlightText(client.nic, search)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {highlightText(client.phone, search)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3.5 w-3.5" />
                          {client.job || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
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
                                Client Actions
                              </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleView(client)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-primary" /> View
                              Details
                            </DropdownMenuItem>
                            <RoleGate allowedRoles={["LOAN_OFFICER", "MORTGAGE_OFFICER", "BRANCH_MANAGER", "ADMIN"]}>

                            <DropdownMenuItem
                              onClick={() => handleEdit(client)}
                              className="gap-2 cursor-pointer"
                              >
                              <UserPen className="w-4 h-4 text-blue-500" /> Edit
                              Client
                            </DropdownMenuItem>
                         

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirmId(client.id)}
                              className="gap-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10"
                              >
                              <Trash2 className="w-4 h-4" /> Delete Client
                            </DropdownMenuItem>
                          
                                </RoleGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <TablePagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-bold">
              Are you sure you want to delete this client? This action cannot be
              undone if the client has no active associations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold px-6 h-12">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black px-8 h-12 shadow-lg shadow-rose-200 transition-all"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
