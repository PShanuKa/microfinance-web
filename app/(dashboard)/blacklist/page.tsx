"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Search, 
  Phone, 
  CreditCard, 
  AlertTriangle, 
  Calendar,
  Eye,
  UserCheck,
  Trash2,
  User2,
  Briefcase,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ClientViewModal } from "@/components/Custom/ClientViewModal";
import TablePagination from "@/components/Custom/TablePagination";
import { useClientsQuery, useUpdateClientMutation, useDeleteClientMutation } from "@/services/clientApi";

export default function BlacklistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

  // Fetch blacklisted clients using standard client query with status filter
  const { data, isLoading, refetch } = useClientsQuery({
    page,
    limit: 10,
    search: searchTerm,
    status: "BLACKLISTED",
  });

  const deleteMutation = useDeleteClientMutation({
    onSuccess: () => {
      setDeleteConfirmId(null);
      refetch();
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.error ||
          "Failed to delete client. They might have active loans or group associations.",
      );
      setDeleteConfirmId(null);
    },
  });

  const updateMutation = useUpdateClientMutation({
    onSuccess: () => {
      setRemoveConfirmId(null);
      refetch();
    },
    onError: (error: any) => {
      alert(
        error.response?.data?.error ||
          "Failed to remove client from blacklist.",
      );
      setRemoveConfirmId(null);
    },
  });

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleRemoveFromBlacklist = () => {
    if (removeConfirmId) {
      updateMutation.mutate({ id: removeConfirmId, status: "ACTIVE" });
    }
  };

  const handleDeleteClient = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const highlightText = (text: string, term: string) => {
    if (!term || !text) return text;
    const parts = text.toString().split(new RegExp(`(${term})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <mark key={i} className="bg-rose-500/20 text-rose-600 font-black rounded-sm px-0.5">
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
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Blacklist"
        description="View and manage clients who have been restricted from the system due to policy violations."
      />

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blacklisted clients by name, ID, or NIC..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-rose-500/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="p-2 px-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
               <AlertTriangle className="h-4 w-4" />
               Total: {data?.pagination?.total || 0} Restricted Profiles
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Client</TableHead>
                  <TableHead className="font-bold text-foreground">NIC Number</TableHead>
                  <TableHead className="font-bold text-foreground">Phone</TableHead>
                  <TableHead className="font-bold text-foreground">Job / Occupation</TableHead>
                  <TableHead className="font-bold text-foreground">Date Restructured</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                      Loading blacklisted clients...
                    </TableCell>
                  </TableRow>
                ) : data?.clients?.length > 0 ? (
                  data.clients.map((client: any) => (
                    <TableRow key={client.id} className="hover:bg-rose-500/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-rose-500/20 transition-colors">
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
                            <span className="font-bold text-foreground group-hover:text-rose-600 transition-colors">
                              {highlightText(client.fullname, searchTerm)}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {highlightText(client.clientNo, searchTerm)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                           {highlightText(client.nic, searchTerm)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                           {highlightText(client.phone, searchTerm)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                           {client.job || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                           <Calendar className="h-3.5 w-3.5" />
                           {formatDate(client.updatedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-none px-3 py-1 rounded-full font-bold text-white bg-rose-500 hover:bg-rose-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            BLACKLISTED
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Blacklist Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(client)} className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4 text-primary" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRemoveConfirmId(client.id)} className="gap-2 text-emerald-600 cursor-pointer">
                              <UserCheck className="h-4 w-4" />
                              Remove from Blacklist
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteConfirmId(client.id)} className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                      No blacklisted clients found.
                    </TableCell>
                  </TableRow>
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

      <ClientViewModal 
        client={selectedClient} 
        open={isViewModalOpen} 
        onOpenChange={setIsViewModalOpen} 
      />

      {/* Remove from Blacklist Confirmation */}
      <AlertDialog
        open={!!removeConfirmId}
        onOpenChange={(open) => !open && setRemoveConfirmId(null)}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
              Restore Client
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-bold">
              Are you sure you want to remove this client from the blacklist? Their status will be set to ACTIVE.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold px-6 h-12">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFromBlacklist}
              disabled={updateMutation.isPending}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 h-12 shadow-lg shadow-emerald-200 transition-all"
            >
              {updateMutation.isPending ? "Restoring..." : "Yes, Restore Client"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              onClick={handleDeleteClient}
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
