"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  User, 
  Building, 
  UserCog, 
  UserPlus,
  Eye, 
  Edit2, 
  Trash2,
  Clock,
  Edit2Icon
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
import { useGroupsQuery } from "@/services/groupApi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function GroupsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGroupsQuery({ page, limit: 10, search: searchTerm });

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge
        className={cn(
          "font-bold px-3 py-1 rounded-full border-none text-white",
          status ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
        )}
      >
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {status ? "Active" : "Inactive"}
        </div>
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4 pb-10">
      <PageHeader
        title="Groups"
        description="Manage microfinance groups, leaders, and collection schedules"
      >
        <Button 
          onClick={() => router.push("/groups/create")}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          New Group
        </Button>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by group name or branch..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[200px] font-bold text-foreground">Group Info</TableHead>
                  <TableHead className="font-bold text-foreground">Members</TableHead>
                  <TableHead className="font-bold text-foreground">Collection Day</TableHead>
                  <TableHead className="font-bold text-foreground">Officer</TableHead>
                  <TableHead className="font-bold text-foreground">Branch</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Loading groups...</TableCell>
                  </TableRow>
                ) : data?.groups?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No groups found.</TableCell>
                  </TableRow>
                ) : (
                  data?.groups?.map((group: any) => (
                    <TableRow key={group.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{group.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{group.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span className="font-bold">{group._count?.members || 0}</span>
                          <span className="text-muted-foreground">Members</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {DAYS[group.collectionDay - 1]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {group.officer?.fullname}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-3.5 w-3.5" />
                          {group.branch}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(group.status)}
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
                              onClick={() => router.push(`/groups/${group.id}/edit`)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit2Icon className="h-4 w-4 text-amber-500" />
                              Manage Group
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <UserPlus className="h-4 w-4 text-emerald-500" />
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
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
