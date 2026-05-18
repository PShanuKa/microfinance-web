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
  DialogDescription,
  DialogFooter,
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
  Calendar,
  ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Reset Password Modal states
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetUser, setResetUser] = useState<any>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { data, isLoading } = useUsersQuery({ page, limit: 10, search });
  const resetPasswordMutation = useResetPasswordMutation();

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleResetPassword = (user: any) => {
    setResetUser(user);
    setNewPasswordInput("");
    setResetError(null);
    setResetSuccess(false);
    setIsResetOpen(true);
  };

  const handleResetPasswordConfirm = () => {
    if (!newPasswordInput || newPasswordInput.length < 6) {
      setResetError("Password must be at least 6 characters.");
      return;
    }

    resetPasswordMutation.mutate(
      { id: resetUser.id, password: newPasswordInput },
      {
        onSuccess: () => {
          setResetSuccess(true);
        },
        onError: (err: any) => {
          setResetError(err.response?.data?.error || "Failed to reset password.");
        }
      }
    );
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
                  <TableHead className="font-bold text-foreground">Branch</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Last Login</TableHead>
                  <TableHead className="font-bold text-foreground">Joined Date</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Loading users...</TableCell>
                  </TableRow>
                ) : data?.users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">No users found.</TableCell>
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
                        {user.branch && user.branch.length > 0 ? (
                          <Badge variant="outline" className="font-black bg-slate-100/80 border-slate-200 text-slate-700 capitalize">
                            {user.branch[0]}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground/60 italic font-bold">No Branch</span>
                        )}
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

      {/* Reset Password Dialog */}
      <Dialog open={isResetOpen} onOpenChange={(open) => {
        setIsResetOpen(open);
        if (!open) {
          setNewPasswordInput("");
          setResetError(null);
          setResetSuccess(false);
        }
      }}>
        <DialogContent className="rounded-3xl p-6 border-slate-200 bg-card/95 backdrop-blur-md max-w-md w-full shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-500" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 text-sm leading-relaxed pt-2">
              Set a new secure password for <strong className="text-slate-800 font-black">{resetUser?.fullname}</strong>.
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="py-6 text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <UserCheck className="w-6 h-6 text-emerald-500 animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">Password Reset Successful</h4>
                <p className="text-xs font-semibold text-slate-500 mt-1">The user's login password has been updated.</p>
              </div>
              <Button
                onClick={() => setIsResetOpen(false)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white shadow-lg shadow-emerald-600/20"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="At least 6 characters..."
                  value={newPasswordInput}
                  onChange={(e) => {
                    setNewPasswordInput(e.target.value);
                    if (e.target.value.length >= 6) setResetError(null);
                  }}
                  className="rounded-xl border-slate-200 font-medium h-12"
                />
                {resetError && (
                  <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {resetError}
                  </span>
                )}
              </div>

              <DialogFooter className="gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsResetOpen(false)}
                  className="font-bold rounded-xl border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleResetPasswordConfirm}
                  disabled={resetPasswordMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-white shadow-lg shadow-blue-600/20"
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Confirm Reset"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
