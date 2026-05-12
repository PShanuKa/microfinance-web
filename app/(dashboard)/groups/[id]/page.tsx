"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  User, 
  Calendar, 
  Building, 
  ArrowLeft, 
  HandCoins, 
  History, 
  UserCheck, 
  Edit,
  Clock,
  CheckCircle2,
  FileText,
  BadgeCent,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

// Mock data for a single group
const groupDetails = {
  id: "G-001",
  name: "Sunlight Group",
  status: "Active",
  leader: "Anura Kumara",
  officer: "Saman Perera",
  branch: "Colombo North",
  collectionDay: "Monday",
  establishedDate: "2025-06-10",
  members: [
    { id: "C-001", name: "Anura Kumara", nic: "741234567V", role: "Leader", status: "Active" },
    { id: "C-005", name: "Saman Kumara", nic: "786543210V", role: "Member", status: "Active" },
    { id: "C-009", name: "Pathum Nissanka", nic: "921122334V", role: "Member", status: "Active" },
    { id: "C-010", name: "Kusal Mendis", nic: "951122334V", role: "Member", status: "Active" },
    { id: "C-011", name: "Wanindu Hasaranga", nic: "971122334V", role: "Member", status: "Active" },
  ],
  loans: [
    { id: "LN-001", type: "Business Loan", amount: 500000, status: "Active", date: "2026-01-10" },
    { id: "LN-054", type: "Emergency Loan", amount: 50000, status: "Completed", date: "2025-08-15" },
  ],
  recentCollections: [
    { id: "COL-101", date: "2026-05-04", week: 16, amount: 15000, status: "Verified" },
    { id: "COL-095", date: "2026-04-27", week: 15, amount: 15000, status: "Verified" },
    { id: "COL-088", date: "2026-04-20", week: 14, amount: 15000, status: "Verified" },
  ]
};

export default function SingleGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  // In a real app, you would fetch group data based on groupId
  const group = groupDetails; 

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-background/80"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{group.name}</h1>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none font-bold">
                {group.status}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium">Group ID: {group.id} • Established {group.establishedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Group
          </Button>
          <Button className="gap-2 shadow-lg">
            <UserCheck className="h-4 w-4" />
            Manage Members
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Leader</p>
                <p className="text-xl font-black mt-1">{group.leader}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                 <User className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Members</p>
                <p className="text-2xl font-black mt-1">{group.members.length} Members</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                 <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Collection Day</p>
                <p className="text-2xl font-black mt-1">{group.collectionDay}</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                 <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg bg-card/60 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Officer</p>
                <p className="text-xl font-black mt-1">{group.officer}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                 <Building className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="bg-card/60 backdrop-blur-md border h-12 p-1 gap-2">
          <TabsTrigger value="loans" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold">
            <HandCoins className="h-4 w-4" />
            Group Loans
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 font-bold">
            <History className="h-4 w-4" />
            Collection History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="mt-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <HandCoins className="h-5 w-5 text-primary" />
                  Active & Past Loans
                </CardTitle>
                <Button size="sm" className="gap-2">
                   <Plus className="h-4 w-4" />
                   Add Loan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Loan ID</TableHead>
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Date Issued</TableHead>
                    <TableHead className="font-bold text-right">Amount</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.loans.map((loan) => (
                    <TableRow key={loan.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono font-bold text-sm">{loan.id}</TableCell>
                      <TableCell className="font-medium">{loan.type}</TableCell>
                      <TableCell className="text-muted-foreground">{loan.date}</TableCell>
                      <TableCell className="text-right font-black text-foreground">Rs. {loan.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={loan.status === "Active" ? "default" : "secondary"} className={cn(
                          "font-bold",
                          loan.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-500 hover:bg-slate-600"
                        )}>
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 font-bold text-primary hover:text-primary hover:bg-primary/10">
                           View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Group Members ({group.members.length})
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Member Name</TableHead>
                    <TableHead className="font-bold">NIC Number</TableHead>
                    <TableHead className="font-bold">Role</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.members.map((member) => (
                    <TableRow key={member.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                           <span className="font-bold">{member.name}</span>
                           <span className="text-xs text-muted-foreground">{member.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{member.nic}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "font-bold border-none",
                          member.role === "Leader" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                           <CheckCircle2 className="h-3 w-3" />
                           {member.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger >
                               <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                                  <MoreVertical className="h-4 w-4" />
                               </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                               <DropdownMenuItem className="gap-2">
                                  <Edit className="h-4 w-4" />
                                  Edit Member
                               </DropdownMenuItem>
                               <DropdownMenuItem className="gap-2 text-destructive">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Recent Collection History
               </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-bold">Collection ID</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Week</TableHead>
                    <TableHead className="font-bold text-right">Amount Paid</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.recentCollections.map((col) => (
                    <TableRow key={col.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono font-bold text-sm text-muted-foreground">{col.id}</TableCell>
                      <TableCell className="font-medium">{col.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold">Week {col.week}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-emerald-600">Rs. {col.amount.toLocaleString()}</TableCell>
                      <TableCell>
                         <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                            <BadgeCent className="h-3 w-3" />
                            {col.status}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 font-bold">
                           View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
