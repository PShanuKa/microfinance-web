"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  User, 
  ShieldCheck, 
  Building, 
  Clock, 
  Mail,
  Eye,
  Edit2,
  Trash2,
  Lock
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/Custom/UserForm";

const usersData = [
  {
    id: "U-001",
    name: "Admin Shanu",
    email: "admin@microfinance.com",
    role: "Admin",
    branch: "Head Office",
    status: "Active",
    lastLogin: "2026-05-12 09:30 AM",
  },
  {
    id: "U-002",
    name: "Saman Perera",
    email: "saman.p@microfinance.com",
    role: "BranchManager",
    branch: "Colombo North",
    status: "Active",
    lastLogin: "2026-05-12 08:15 AM",
  },
  {
    id: "U-003",
    name: "Kamal Siri",
    email: "kamal.s@microfinance.com",
    role: "LoanOfficer",
    branch: "Kaduwela",
    status: "Active",
    lastLogin: "2026-05-11 10:00 AM",
  },
  {
    id: "U-004",
    name: "Nimal Gunawardena",
    email: "nimal.g@microfinance.com",
    role: "Auditor",
    branch: "Colombo North",
    status: "Inactive",
    lastLogin: "2026-05-05 02:20 PM",
  },
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredUsers = usersData.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="User Management"
        description="Configure system access, roles, and administrative permissions."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Register New User</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new system user with specific roles and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <UserForm onSuccess={() => setIsAddModalOpen(false)} onCancel={() => setIsAddModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or role..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" className="gap-2 h-11 rounded-lg">
                 <Filter className="h-4 w-4" />
                 All Roles
               </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">User</TableHead>
                  <TableHead className="font-bold text-foreground">Role</TableHead>
                  <TableHead className="font-bold text-foreground">Branch</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Last Login</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {user.name.charAt(0)}
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-foreground">{user.name}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                               <Mail className="h-3 w-3" />
                               {user.email}
                            </span>
                         </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">{user.role}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-sm">
                          <Building className="h-3.5 w-3.5 text-muted-foreground" />
                          {user.branch}
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge 
                         variant={user.status === "Active" ? "default" : "secondary"}
                         className={cn(
                           "font-bold",
                           user.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-500"
                         )}
                       >
                         {user.status}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {user.lastLogin}
                       </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>User Options</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4 text-primary" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit2 className="h-4 w-4 text-emerald-500" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Lock className="h-4 w-4 text-amber-500" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
