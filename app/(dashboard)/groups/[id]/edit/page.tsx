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
import { 
  Plus, 
  UserPlus, 
  Trash2, 
  Crown, 
  Search,
  ArrowLeft,
  Save,
  Settings2,
  Edit2
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: groupData, isLoading: groupLoading } = useGroupQuery(id as string);
  const { data: clientsData } = useClientsQuery({ search: clientSearch, limit: 5 });
  const { data: userData } = useUsersQuery({ role: "LOAN_OFFICER", limit: 100 });

  const updateGroupMutation = useUpdateGroupMutation({
    onSuccess: () => setIsEditingInfo(false)
  });
  const addMemberMutation = useAddMemberMutation();
  const updateMemberMutation = useUpdateMemberMutation();
  const removeMemberMutation = useRemoveMemberMutation();
  const deleteMutation = useDeleteGroupMutation({
    onSuccess: () => {
      router.push("/groups");
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      branch: "",
      collectionDay: 1,
      officerId: "",
      location: "",
    },
  });

  useEffect(() => {
    if (groupData?.group) {
      reset({
        name: groupData.group.name,
        branch: groupData.group.branch,
        collectionDay: groupData.group.collectionDay,
        officerId: groupData.group.officerId,
        location: groupData.group.location || "",
      });
    }
  }, [groupData, reset]);

  const selectedDay = watch("collectionDay");
  const selectedOfficer = watch("officerId");

  const onUpdateGroup = (data: any) => {
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

  const handleRemoveMember = (memberId: string) => {
    if (confirm("Remove this member from the group?")) {
      removeMemberMutation.mutate(memberId as string);
    }
  };

  const handleDeleteGroup = () => {
    deleteMutation.mutate(id as string);
  };

  if (groupLoading) return <div className="p-10 text-center">Loading group data...</div>;

  const group = groupData?.group;

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title={`Manage Group: ${group?.name}`}
        description={`Branch: ${group?.branch} | Location: ${group?.location || "N/A"} | Collection Day: ${DAYS[(group?.collectionDay || 1) - 1].name}`}
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
            onClick={() => setIsDeleteDialogOpen(true)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Group name is required" })}
                    className={cn("bg-background/50", errors.name && "border-destructive")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    {...register("branch", { required: "Branch is required" })}
                    className={cn("bg-background/50", errors.branch && "border-destructive")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location / Area</Label>
                  <Input
                    id="location"
                    {...register("location", { required: "Location is required" })}
                    className={cn("bg-background/50", errors.location && "border-destructive")}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Collection Day</Label>
                  <Select
                    value={selectedDay.toString()}
                    onValueChange={(val) => setValue("collectionDay", Number(val || 1))}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.id} value={day.id.toString()}>
                          {day.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Collection Officer</Label>
                  <Select
                    value={selectedOfficer}
                    onValueChange={(val) => setValue("officerId", val || "")}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {userData?.users?.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                            className="text-muted-foreground hover:text-amber-600"
                            onClick={() => handleSetLeader(member.id)}
                          >
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
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
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
                className="pl-10"
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {clientsData?.clients?.map((client: any) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-background/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{client.fullname}</span>
                    <span className="text-xs text-muted-foreground">{client.nic}</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddMember(client.id)}
                    disabled={addMemberMutation.isPending}
                  >
                    Add
                  </Button>
                </div>
              ))}
              {clientsData?.clients?.length === 0 && clientSearch && (
                <p className="text-center text-muted-foreground py-4">No clients found.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" /> Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group <strong>{group?.name}</strong> and remove all member associations.
              <br /><br />
              <span className="text-xs font-bold text-rose-600 uppercase">Warning: This group cannot be deleted if it has ANY associated loan applications (Draft, Pending, or Active).</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGroup}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Group"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
