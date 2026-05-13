"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { PageHeader } from "@/components/Custom/PageHeader";
import { 
  useGroupQuery, 
  useAddMemberMutation, 
  useUpdateMemberMutation, 
  useRemoveMemberMutation 
} from "@/services/groupApi";
import { useClientsQuery } from "@/services/clientApi";
import { 
  Plus, 
  UserPlus, 
  Trash2, 
  Crown, 
  ShieldCheck, 
  Eye, 
  Search,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MemberDetailsModal } from "@/components/Custom/MemberDetailsModal";

export default function EditGroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: groupData, isLoading: groupLoading } = useGroupQuery(id as string);
  const { data: clientsData } = useClientsQuery({ search: clientSearch, limit: 5 });

  const addMemberMutation = useAddMemberMutation();
  const updateMemberMutation = useUpdateMemberMutation();
  const removeMemberMutation = useRemoveMemberMutation();

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
      removeMemberMutation.mutate(memberId);
    }
  };

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setIsDetailsOpen(true);
  };

  if (groupLoading) return <div className="p-10 text-center">Loading group data...</div>;

  const group = groupData?.group;

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title={`Manage Group: ${group?.name}`}
        description={`Branch: ${group?.branch} | Collection Day: ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][(group?.collectionDay || 1) - 1]}`}
      >
        <Button variant="outline" onClick={() => router.push("/groups")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Groups
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6">
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
                    <TableHead className="font-bold text-foreground text-center">Leader</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Guarantors</TableHead>
                    <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group?.members?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
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
                            <span className="text-amber-600"><Crown className="w-5 h-5 mx-auto" /></span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={cn(
                            "rounded-full px-3",
                            member.guarantors?.length === 2 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                          )}>
                            {member.guarantors?.length || 0} / 2
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewMember(member)}>
                              <Eye className="w-4 h-4 text-primary" />
                            </Button>
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
      </div>

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

      {/* Member Details Modal (Guarantors management) */}
      <MemberDetailsModal 
        member={selectedMember}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
}
