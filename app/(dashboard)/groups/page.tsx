"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Calendar, 
  ArrowUpRight,
  Eye,
  Trash2,
  Settings2,
  UserCheck,
  User,
  Crown,
  Phone,
  Building
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { useGroupsQuery, useDeleteGroupMutation } from "@/services/groupApi";
import { useBranchesQuery } from "@/services/branchApi";
import { useGetMeQuery } from "@/services/authApi";
import { RoleGate } from "@/components/Custom/RoleGate";
import { SearchFilterPanel } from "@/components/Custom/SearchFilterPanel";
import { useDialogStore } from "@/store/useDialogStore";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function GroupsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get current user profile for role and branch restriction
  const { data: meData } = useGetMeQuery();
  const currentUser = meData?.user;

  // URL synced filters
  const statusFilter = searchParams.get("status") || "All";
  const collectionDayFilter = searchParams.get("collectionDay") || "All";
  const branchFilter = searchParams.get("branchId") || "All";

  // Check if branch select filter should be locked/disabled
  const isBranchSelectDisabled = currentUser?.role !== "ADMIN" && !!currentUser?.branchId;
  const effectiveBranchFilter = isBranchSelectDisabled
    ? currentUser.branchId
    : branchFilter;

  const { data: branchesData } = useBranchesQuery();

  
  const branches = branchesData?.branches || [];
  
  const { setOpen } = useDialogStore();

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

  const { data, isLoading } = useGroupsQuery({ 
    page, 
    limit: 10, 
    search: searchTerm,
    status: statusFilter,
    collectionDay: collectionDayFilter,
    branchId: effectiveBranchFilter
  });

  const deleteMutation = useDeleteGroupMutation();

  const handleDeleteClick = (group: any) => {
    setOpen({
      open: true,
      type: "delete",
      title: "Confirm Delete",
      message: `This will permanently delete the group ${group.name} and remove all member associations. Warning: This group cannot be deleted if it has ANY associated loan applications.`,
      onConfirm: () => {
        deleteMutation.mutate(group.id, {
          onSuccess: () => {
            setOpen({
              open: true,
              type: "success",
              title: "Action Complete",
              message: "Group deleted successfully."
            });
          },
          onError: (err: any) => {
            setOpen({
              open: true,
              type: "error",
              title: "Delete Failed",
              message: err.response?.data?.error || "Failed to delete group."
            });
          }
        });
      }
    });
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
    <div className="flex flex-col gap-3 w-full md:px-4 pb-10">
      <PageHeader
        title="Groups"
        description="Manage microfinance groups, their members, and collection schedules"
      >
         <RoleGate allowedRoles={["ADMIN", "BRANCH_MANAGER", "LOAN_OFFICER"]}>
        <Button 
          onClick={() => router.push("/groups/create")}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Create New Group
        </Button>
      </RoleGate>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val);
              setPage(1);
            }}
            searchPlaceholder="Search by ID, Name, Officer or Leader..."
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
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Collection Day</Label>
                <Select
                  value={collectionDayFilter}
                  onValueChange={(val) => updateFilters({ collectionDay: val || "All" })}
                >
                  <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Collection Day" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Days</SelectItem>
                    {DAYS.map((day, idx) => (
                      <SelectItem key={day} value={(idx + 1).toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-auto">
                <Label className="text-xs text-muted-foreground ml-1">Branch</Label>
                <Select
                  value={effectiveBranchFilter}
                  onValueChange={(val) => updateFilters({ branchId: val || "All" })}
                  disabled={isBranchSelectDisabled}
                >
                  <SelectTrigger className="w-full md:w-[180px] h-10 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <SelectValue>
                        {effectiveBranchFilter && effectiveBranchFilter !== "All"
                          ? (branches.find((b: any) => b.id === effectiveBranchFilter)?.name || "Select branch")
                          : "All Branches"}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Branches</SelectItem>
                    {branches.map((b: any) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(statusFilter !== "All" || collectionDayFilter !== "All" || (!isBranchSelectDisabled && branchFilter !== "All")) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters({ status: "All", collectionDay: "All", branchId: isBranchSelectDisabled ? currentUser?.branchId : "All" })}
                  className="text-rose-500 hover:text-rose-600 h-10 mb-0.5"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </SearchFilterPanel>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[200px] font-bold text-foreground">Group Name</TableHead>
                  <TableHead className="font-bold text-foreground">Branch</TableHead>
                  <TableHead className="font-bold text-foreground">Officer</TableHead>
                  <TableHead className="font-bold text-foreground">Leader</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Members</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Loading groups...</TableCell>
                  </TableRow>
                ) : data?.groups?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No groups found.</TableCell>
                  </TableRow>
                ) : (
                  data?.groups?.map((group: any) => (
                    <TableRow key={group.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {highlightText(group.name, searchTerm)}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase">
                            {highlightText(group.groupNo || group.id, searchTerm)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            {group.branch?.name || "Main Branch"}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            {DAYS[group.collectionDay - 1]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <User className="h-3.5 w-3.5 text-primary/60" />
                          {highlightText(group.officer?.fullname || "N/A", searchTerm)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const leader = group.members?.find((m: any) => m.isLeader);
                          if (!leader) return <span className="text-xs text-muted-foreground italic">No Leader</span>;
                          return (
                            <div className="flex flex-col">
                              <span className="text-sm font-bold flex items-center gap-1">
                                <Crown className="h-3 w-3 text-amber-500" />
                                {highlightText(leader.client?.fullname, searchTerm)}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Phone className="h-2.5 w-2.5" />
                                {leader.client?.phone}
                              </span>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 rounded-full font-bold">
                          <Users className="h-3 w-3" />
                          {group._count?.members || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("px-3 py-1 rounded-full font-bold border-none text-white", group.status ? "bg-emerald-500" : "bg-rose-500")}>
                          {group.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => router.push(`/groups/${group.id}`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Group Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => router.push(`/groups/${group.id}/edit`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Settings2 className="h-4 w-4 text-muted-foreground" />
                              Edit Group Info
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 text-destructive cursor-pointer"
                              onClick={() => handleDeleteClick(group)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Group
                            </DropdownMenuItem>
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
            <div className="p-4 border-t bg-muted/20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }} 
                      className={cn(page === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  
                  {[...Array(data.pagination.totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); if (page < data.pagination.totalPages) setPage(page + 1); }}
                      className={cn(page === data.pagination.totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
