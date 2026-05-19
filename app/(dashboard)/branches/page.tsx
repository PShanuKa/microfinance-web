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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  MoreVertical, 
  Plus, 
  Search, 
  Building,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { useBranchesQuery, useDeleteBranchMutation } from "@/services/branchApi";
import { BranchForm } from "@/components/Custom/BranchForm";
import { format } from "date-fns";
import { toast } from "sonner";

export default function BranchManagementPage() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  
  // Delete Dialog states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState<any>(null);

  const { data, isLoading } = useBranchesQuery();
  const deleteMutation = useDeleteBranchMutation();

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingBranch(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (branch: any) => {
    setDeletingBranch(branch);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingBranch) return;

    deleteMutation.mutate(deletingBranch.id, {
      onSuccess: () => {
        toast.success("Branch deleted successfully!");
        setIsDeleteOpen(false);
        setDeletingBranch(null);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.error || "Failed to delete branch. Ensure no groups or users are assigned to this branch.");
        setIsDeleteOpen(false);
        setDeletingBranch(null);
      }
    });
  };

  const branches = data?.branches || [];

  // Filter branches client-side based on search query
  const filteredBranches = branches.filter((b: any) => 
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Branch Management"
        description="Configure and manage corporate microfinance branches"
      >
        <Button 
          onClick={handleCreate}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search branches by name or address..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Branch Details</TableHead>
                  <TableHead className="font-bold text-foreground">Address</TableHead>
                  <TableHead className="font-bold text-foreground">Created Date</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Loading branches...</TableCell>
                  </TableRow>
                ) : filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No branches found.</TableCell>
                  </TableRow>
                ) : (
                  filteredBranches.map((branch: any) => (
                    <TableRow key={branch.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-105 transition-transform shrink-0">
                            <Building className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{branch.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{branch.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[300px] font-medium">{branch.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {branch.createdAt ? format(new Date(branch.createdAt), "yyyy-MM-dd") : "N/A"}
                        </div>
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
                              <DropdownMenuLabel>Branch Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(branch)} className="gap-2 cursor-pointer">
                              <Edit2 className="w-4 h-4 text-primary" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(branch)} className="gap-2 cursor-pointer text-rose-600 hover:text-rose-700">
                              <Trash2 className="w-4 h-4" /> Delete Branch
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
        </CardContent>
      </Card>

      {/* Creation / Editing Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingBranch ? "Edit Branch details" : "Register New Branch"}</DialogTitle>
          </DialogHeader>
          <BranchForm 
            initialData={editingBranch} 
            onSuccess={() => {
              toast.success(editingBranch ? "Branch updated successfully!" : "Branch created successfully!");
              setIsFormOpen(false);
            }} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-3xl p-6 border-slate-200 bg-card/95 backdrop-blur-md max-w-md w-full shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="font-semibold text-slate-500 text-sm leading-relaxed pt-2">
              Are you absolutely sure you want to delete branch <strong className="text-slate-800 font-black">{deletingBranch?.name}</strong>?
              <br />
              <span className="text-xs text-rose-500 font-black uppercase tracking-widest mt-1 block">This action is permanent and cannot be undone.</span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="font-bold rounded-xl border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 font-bold rounded-xl text-white shadow-lg shadow-rose-600/20"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
