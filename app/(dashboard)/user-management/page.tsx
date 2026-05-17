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
  DropdownMenuGroup
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
  KeyRound, 
  UserMinus, 
  UserCheck,
  Clock,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import TablePagination from "@/components/Custom/TablePagination";
import { useUsersQuery, useUpdateUserStatusMutation, useResetPasswordMutation } from "@/services/userApi";
import { UserForm } from "@/components/Custom/UserForm";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data, isLoading } = useUsersQuery({ page, limit: 10, search });
  const statusMutation = useUpdateUserStatusMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (user: any) => {
    if (confirm(`Are you sure you want to ${user.status ? "deactivate" : "activate"} this user?`)) {
      statusMutation.mutate({ id: user.id, status: !user.status });
    }
  };

  const handleResetPassword = (user: any) => {
    const newPassword = prompt("Enter new password (min 6 characters):");
    if (newPassword && newPassword.length >= 6) {
      resetPasswordMutation.mutate({ id: user.id, password: newPassword });
      alert("Password reset request sent.");
    } else if (newPassword) {
      alert("Password too short.");
    }
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge 
        className={cn(
          "border-none px-3 py-1 rounded-full font-bold",
          status 
            ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
            : "bg-rose-500 hover:bg-rose-600 text-white"
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
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions"
      >
        <Button 
          onClick={handleCreate}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">User Details</TableHead>
                  <TableHead className="font-bold text-foreground">Role</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Last Login</TableHead>
                  <TableHead className="font-bold text-foreground">Joined Date</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Loading users...</TableCell>
                  </TableRow>
                ) : data?.users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No users found.</TableCell>
                  </TableRow>
                ) : (
                  data?.users?.map((user: any) => (
                    <TableRow key={user.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">{user.fullname}</span>
                          <span className="text-xs text-muted-foreground font-mono">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold capitalize border-primary/20 text-primary">
                          {user.role?.toLowerCase().replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {user.lastLogin ? format(new Date(user.lastLogin), "MMM dd, HH:mm") : "Never"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(user.createdAt), "yyyy-MM-dd")}
                        </div>
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
                              <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(user)} className="gap-2 cursor-pointer">
                              <UserPen className="w-4 h-4 text-primary" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)} className="gap-2 cursor-pointer">
                              <KeyRound className="w-4 h-4 text-blue-500" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(user)} 
                              className={cn(
                                "gap-2 cursor-pointer",
                                user.status ? "text-rose-500" : "text-emerald-500"
                              )}
                            >
                              {user.status ? (
                                <><UserMinus className="w-4 h-4" /> Deactivate User</>
                              ) : (
                                <><UserCheck className="w-4 h-4" /> Activate User</>
                              )}
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
            <TablePagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingUser ? "Edit User Account" : "Create New User Account"}</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={editingUser} 
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
