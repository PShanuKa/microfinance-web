"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/Custom/PageHeader";
import { useGroupQuery } from "@/services/groupApi";
import { 
  ArrowLeft, 
  Users, 
  User, 
  Building, 
  Calendar, 
  HandCoins,
  ShieldCheck,
  Crown,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ViewGroupPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: groupData, isLoading } = useGroupQuery(id as string);

  if (isLoading) return <div className="p-10 text-center text-muted-foreground">Loading group details...</div>;
  if (!groupData?.group) return <div className="p-10 text-center text-muted-foreground">Group not found.</div>;

  const group = groupData.group;

  const getLoanStatusBadge = (status: string) => {
    const baseStyle = "px-2 py-0.5 rounded-full font-bold text-[10px] text-white flex items-center gap-1 w-fit uppercase";
    switch (status) {
      case "APPROVED":
        return <Badge className={cn(baseStyle, "bg-emerald-500")}><CheckCircle2 className="h-3 w-3" />Approved</Badge>;
      case "PENDING":
        return <Badge className={cn(baseStyle, "bg-amber-500")}><Clock className="h-3 w-3" />Pending</Badge>;
      case "REJECTED":
        return <Badge className={cn(baseStyle, "bg-rose-500")}><XCircle className="h-3 w-3" />Rejected</Badge>;
      case "COMPLETED":
        return <Badge className={cn(baseStyle, "bg-blue-500")}><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case "DRAFT":
        return <Badge variant="outline" className="text-muted-foreground px-2 py-0.5 rounded-full font-bold text-[10px]">Draft</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title={group.name}
        description={`Group details, members, and active loans for ${group.branch} branch.`}
      >
        <Button variant="outline" onClick={() => router.push("/groups")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Groups
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Group Stats & Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" /> Group Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Branch</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Building className="h-4 w-4 text-primary/60" />
                    {group.branch}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Collection Day</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary/60" />
                    {DAYS[group.collectionDay - 1]}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Collection Officer</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/60" />
                    {group.officer?.fullname}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">Status</p>
                  <Badge className={cn("font-bold border-none text-white", group.status ? "bg-emerald-500" : "bg-rose-500")}>
                    {group.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-primary text-primary-foreground">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold opacity-70">Total Members</p>
                <p className="text-3xl font-black">{group.members?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                 <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members & Loans */}
        <div className="md:col-span-2 space-y-6">
          {/* Members Table */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 border-none">
                    <TableHead className="font-bold text-foreground">Name</TableHead>
                    <TableHead className="font-bold text-foreground">NIC</TableHead>
                    <TableHead className="font-bold text-foreground">Role</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Guarantors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.members?.map((member: any) => (
                    <TableRow key={member.id} className="hover:bg-primary/5 transition-colors border-muted/50">
                      <TableCell className="font-bold">{member.client?.fullname}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{member.client?.nic}</TableCell>
                      <TableCell>
                        {member.isLeader ? (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-bold">
                            <Crown className="w-3 h-3 mr-1" /> LEADER
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-bold">MEMBER</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-1">
                          <ShieldCheck className={cn("w-4 h-4", member.guarantors?.length >= 2 ? "text-emerald-500" : "text-rose-500")} />
                          <span className="text-xs font-bold">{member.guarantors?.length || 0}/2</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {group.members?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-20 text-center text-muted-foreground italic">No members assigned.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Loans Table */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <HandCoins className="w-5 h-5 text-primary" /> Group Loans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20 border-none">
                    <TableHead className="font-bold text-foreground">Loan ID</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Lent (L/M)</TableHead>
                    <TableHead className="font-bold text-foreground text-right">Weekly (L/M)</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Status</TableHead>
                    <TableHead className="font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.loans?.map((loan: any) => (
                    <TableRow key={loan.id} className="hover:bg-primary/5 transition-colors border-muted/50">
                      <TableCell className="font-mono text-[11px] font-bold">{loan.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col text-[10px]">
                          <span className="font-bold">L: Rs.{Number(loan.leaderLentAmount).toLocaleString()}</span>
                          <span className="text-muted-foreground">M: Rs.{Number(loan.memberLentAmount).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col text-[10px]">
                          <span className="font-bold text-emerald-600">L: Rs.{Number(loan.leaderWeeklyAmount).toLocaleString()}</span>
                          <span className="text-muted-foreground">M: Rs.{Number(loan.memberWeeklyAmount).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="flex justify-center py-4">
                        {getLoanStatusBadge(loan.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/loans/${loan.id}`)}>
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {group.loans?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-20 text-center text-muted-foreground italic">No loans history.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
