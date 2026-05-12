"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, UserPlus, ArrowLeft, Trash2, Eye, Edit2, Shield, UserCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/Custom/FormModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function CreateGroupPage() {
  const router = useRouter();
  const [members, setMembers] = useState([
    { id: "C-001", name: "Anura Kumara", nic: "741234567V", role: "Leader" },
    { id: "C-002", name: "Sunil Perera", nic: "823456789V", role: "Member" },
  ]);

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Back to Groups</span>
      </div>

      <PageHeader
        title="Create New Group"
        description="Fill in the details to establish a new microfinance group and assign members."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group Details Form */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Group Details</CardTitle>
            <CardDescription>Primary information about the group.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName" className="font-semibold">Group Name</Label>
              <Input id="groupName" placeholder="e.g. Sunlight Group" className="bg-background/50" />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Branch</Label>
              <Select>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colombo-north">Colombo North</SelectItem>
                  <SelectItem value="colombo-south">Colombo South</SelectItem>
                  <SelectItem value="kaduwela">Kaduwela</SelectItem>
                  <SelectItem value="malabe">Malabe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Collection Day</Label>
              <Select>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Collection Officer</Label>
              <Select>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select Officer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officer-1">Saman Perera</SelectItem>
                  <SelectItem value="officer-2">Kamal Siri</SelectItem>
                  <SelectItem value="officer-3">Nimal Gunawardena</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button className="w-full shadow-lg shadow-primary/20">Save Group</Button>
            </div>
          </CardContent>
        </Card>

        {/* Members Management */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Group Members</CardTitle>
              <CardDescription>Add and manage clients assigned to this group.</CardDescription>
            </div>
            <div className="flex gap-2">
              <FormModal trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Member
                </Button>
              } />
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Existing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-muted/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Member ID</TableHead>
                    <TableHead className="font-bold">Full Name</TableHead>
                    <TableHead className="font-bold">NIC Number</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="font-medium text-primary">{member.id}</TableCell>
                      <TableCell className="font-bold">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">{member.nic}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                          member.role === 'Leader' 
                            ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' 
                            : 'bg-primary/10 text-primary ring-primary/20'
                        }`}>
                          {member.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4 text-primary" />
                              View Member
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit2 className="h-4 w-4" />
                              Edit Member
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Shield className="h-4 w-4 text-emerald-500" />
                              Add Guarantors
                            </DropdownMenuItem>
                            {member.role !== 'Leader' && (
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <UserCheck className="h-4 w-4 text-amber-500" />
                                Promote Leader
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {members.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                No members added yet. Use the buttons above to add clients to this group.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
