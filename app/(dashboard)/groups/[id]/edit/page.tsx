"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/Custom/PageHeader";
import { 
  useGroupQuery, 
  useUpdateGroupMutation,
  useAddMemberMutation, 
  useUpdateMemberMutation, 
  useRemoveMemberMutation,
  useDeleteGroupMutation
} from "@/services/groupApi";
import { useClientsQuery } from "@/services/clientApi";
import { useUsersQuery } from "@/services/userApi";
import { useBranchesQuery } from "@/services/branchApi";
import { 
  Plus, 
  UserPlus, 
  Trash2, 
  Crown, 
  Search,
  ArrowLeft,
  Save,
  Settings2,
  Edit2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDialogStore } from "@/store/useDialogStore";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

export default function EditGroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Delete Dialog State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const { setOpen } = useDialogStore();

  const { data: groupData, isLoading: groupLoading } = useGroupQuery(id as string);
  const { data: branchesData, isLoading: isLoadingBranches } = useBranchesQuery();
  const branches = branchesData?.branches || [];
  const { data: clientsData, isLoading: isClientsLoading } = useClientsQuery({ search: clientSearch, limit: 5 });
  const { data: userData } = useUsersQuery({ role: "COLLECTION_OFFICER", limit: 100 });

  const handleApiError = (error: any) => {
    const response = error.response?.data;
    
    if (response?.error) {
      setServerError(response.error);
    }

    if (response?.fields) {
      Object.keys(response.fields).forEach((field: any) => {
        setError(field as any, { type: "manual", message: response.fields[field] });
      });
    } else if (!response?.error) {
      setServerError("An error occurred. Please try again.");
    }
  };

  const updateGroupMutation = useUpdateGroupMutation({
    onSuccess: () => setIsEditingInfo(false),
    onError: (error: any) => handleApiError(error),
  });
  const addMemberMutation = useAddMemberMutation({
    onSuccess: () => setIsEditingInfo(false),
    onError: (error: any) => toast.error(error.response?.data?.error || "Failed to add member."),
  });
  const updateMemberMutation = useUpdateMemberMutation({
    onSuccess: () => setIsEditingInfo(false),
    onError: (error: any) => toast.error(error.response?.data?.error || "Failed to update member."),
  });
  const removeMemberMutation = useRemoveMemberMutation({
    onSuccess: () => setIsEditingInfo(false),
    onError: (error: any) => toast.error(error.response?.data?.error || "Failed to remove member."),
  });
  const deleteMutation = useDeleteGroupMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      branchId: "",
      collectionDay: 1,
      officerId: "",
      location: "",
    },
  });

  useEffect(() => {
    if (groupData?.group) {
      reset({
        name: groupData.group.name,
        branchId: groupData.group.branchId || groupData.group.branch?.id || "",
        collectionDay: groupData.group.collectionDay,
        officerId: groupData.group.officerId,
        location: groupData.group.location || "",
      });
    }
  }, [groupData, reset]);

  const selectedDay = watch("collectionDay");
  const selectedOfficer = watch("officerId");
  const selectedBranchId = watch("branchId");

  const onUpdateGroup = (data: any) => {
    setServerError(null);
    updateGroupMutation.mutate({
      id: id as string,
      ...data,
      collectionDay: Number(data.collectionDay),
      updatedBy: "system",
    });
  };

  const handleAddMember = (clientId: string) => {
    addMemberMutation.mutate({ groupId: id, clientId }, {
      onSuccess: () => setIsAddMemberOpen(false)
    });
  };

  const handleSetLeader = (memberId: string) => {
    updateMemberMutation.mutate({ memberId, isLeader: true });
  };

  const handleRemoveMember = (member: any) => {
    setOpen({
      open: true,
      type: "delete",
      title: "Remove Member",
      message: `Are you sure you want to remove ${member.client?.fullname} from the group? This will dissolve their member association.`,
      onConfirm: () => {
        removeMemberMutation.mutate(member.id, {
          onSuccess: () => {
            setOpen({
              open: true,
              type: "success",
              title: "Action Complete",
              message: "Member removed successfully."
            });
          },
          onError: (err: any) => {
            setOpen({
              open: true,
              type: "error",
              title: "Remove Failed",
              message: err.response?.data?.error || "Failed to remove member."
            });
          }
        });
      }
    });
  };

  const handleDeleteGroupClick = () => {
    setOpen({
      open: true,
      type: "delete",
      title: "Delete Group",
      message: `This will permanently delete the group ${group?.name} and remove all member associations. Warning: This group cannot be deleted if it has ANY associated loan applications.`,
      onConfirm: () => {
        deleteMutation.mutate(id as string, {
          onSuccess: () => {
            setOpen({
              open: true,
              type: "success",
              title: "Action Complete",
              message: "Group deleted successfully."
            });
            setTimeout(() => router.push("/groups"), 1500);
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

  if (groupLoading) return <div className="p-10 text-center">Loading group data...</div>;

  const group = groupData?.group;

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title={`Manage Group: ${group?.name}`}
        description={`Branch: ${group?.branch?.name || "N/A"} | Location: ${group?.location || "N/A"} | Collection Day: ${DAYS[(group?.collectionDay || 1) - 1].name}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/groups")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button 
            variant={isEditingInfo ? "secondary" : "outline"} 
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" /> 
            {isEditingInfo ? "Cancel Editing" : "Edit Group Info"}
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteGroupClick}
            className="gap-2 shadow-lg shadow-destructive/20"
          >
            <Trash2 className="h-4 w-4" /> Delete Group
          </Button>
        </div>
      </PageHeader>

      {isEditingInfo && (
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
               <Edit2 className="w-5 h-5 text-primary" /> Update Group Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onUpdateGroup)} className="space-y-6">
              {serverError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={cn("bg-background/50", errors.name && "border-destructive")}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>Branch</Label>
                  <Select
                    value={selectedBranchId || "none"}
                    onValueChange={(val) => setValue("branchId", val && val !== "none" ? val : "")}
                    disabled
                  >
                    <SelectTrigger className={cn("bg-background/50", errors.branchId && "border-destructive")}>
                      <SelectValue>
                        {selectedBranchId && selectedBranchId !== "none"
                          ? (branches.find((b: any) => b.id === selectedBranchId)?.name || "Select branch")
                          : "None / No Branch"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None / No Branch</SelectItem>
                      {branches.map((b: any) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Branch association cannot be modified after group creation.
                  </p>
                  {errors.branchId && <p className="text-xs text-destructive">{errors.branchId.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location / Area</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    className={cn("bg-background/50", errors.location && "border-destructive")}
                  />
                  {errors.location && <p className="text-xs text-destructive">{errors.location.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>Collection Day</Label>
                  <Select
                    value={selectedDay?.toString()}
                    onValueChange={(val) => setValue("collectionDay", Number(val))}
                  >
                    <SelectTrigger className={cn("bg-background/50", errors.collectionDay && "border-destructive")}>
                      <SelectValue>
                        {DAYS.find(d => d.id === Number(selectedDay))?.name || "Select day"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.id} value={day.id.toString()}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.collectionDay && <p className="text-xs text-destructive">{errors.collectionDay.message as string}</p>}
                </div>

                <div className="grid gap-2">
                  <Label>Collection Officer</Label>
                  <Select
                    value={selectedOfficer}
                    onValueChange={(val) => setValue("officerId", val || "")}
                  >
                    <SelectTrigger className={cn("bg-background/50", errors.officerId && "border-destructive")}>
                      <SelectValue>
                        {userData?.users?.find((u: any) => u.id === selectedOfficer)?.fullname || "Select officer"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {userData?.users?.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.officerId && <p className="text-xs text-destructive">{errors.officerId.message as string}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditingInfo(false)}>Cancel</Button>
                <Button type="submit" disabled={updateGroupMutation.isPending} className="gap-2">
                  <Save className="h-4 w-4" /> {updateGroupMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members Table */}
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
          <CardTitle className="text-xl font-bold">Group Members</CardTitle>
          <Button onClick={() => setIsAddMemberOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Add Member
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Member</TableHead>
                  <TableHead className="font-bold text-foreground">NIC</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Leader Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group?.members?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                      No members added yet. Click "Add Member" to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  group?.members?.map((member: any) => (
                    <TableRow key={member.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground flex items-center gap-2">
                            {member.client?.fullname}
                            {member.isLeader && (
                              <Badge variant="default" className="bg-amber-500 text-[10px] h-5 px-1.5">
                                <Crown className="w-3 h-3 mr-1" /> Leader
                              </Badge>
                            )}
                            {member.client?.status === "BLACKLISTED" && (
                              <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] h-5 px-1.5 font-bold hover:bg-rose-500/20">
                                Blacklisted
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">{member.client?.clientNo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{member.client?.nic}</TableCell>
                      <TableCell className="text-center">
                        {!member.isLeader ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-amber-600 gap-2"
                            onClick={() => handleSetLeader(member.id)}
                            disabled={updateMemberMutation.isPending && updateMemberMutation.variables?.memberId === member.id}
                          >
                            {updateMemberMutation.isPending && updateMemberMutation.variables?.memberId === member.id && (
                              <Spinner className="w-3 h-3" />
                            )}
                            Make Leader
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm">
                            <Crown className="w-4 h-4" /> Leader
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Client to Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or NIC..." 
                className="pl-10 pr-10"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
              {isClientsLoading && (
                <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              )}
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {clientsData?.clients?.map((client: any) => {
                const isAlreadyMember = group?.members?.some((m: any) => m.clientId === client.id);
                const hasActiveLoan = client.instalments?.some(
                  (inst: any) => inst.loan?.status === "APPROVED" || inst.loan?.status === "ACTIVE"
                );
                return (
                  <div 
                    key={client.id} 
                    className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold flex items-center gap-2">
                        {client.fullname}
                        {client.status === "BLACKLISTED" && (
                          <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] h-5 px-1.5 font-bold hover:bg-rose-500/20">
                            Blacklisted
                          </Badge>
                        )}
                        {hasActiveLoan && (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] h-5 px-1.5 font-bold hover:bg-emerald-500/20">
                            Active Loan
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{client.nic}</span>
                    </div>
                    {isAlreadyMember ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 px-3 py-1">
                        <Check className="w-3 h-3" /> Already Added
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleAddMember(client.id)}
                        disabled={addMemberMutation.isPending}
                        className="px-6"
                      >
                        Add
                      </Button>
                    )}
                  </div>
                );
              })}
              {clientsData?.clients?.length === 0 && clientSearch && (
                <p className="text-center text-muted-foreground py-4">No clients found.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
