"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MoreVertical, 
  CalendarOff, 
  Search, 
  User, 
  Calendar, 
  Clock, 
  Info,
  Edit2,
  Eye,
  Trash2,
  CalendarDays,
  Edit2Icon
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
import { NonCollectionForm } from "@/components/Custom/NonCollectionForm";

const mockData = [
  {
    id: "NCW-001",
    startDate: "2026-04-12",
    endDate: "2026-04-18",
    reason: "Sinhala & Hindu New Year Holidays",
    createdBy: "Admin Sarah",
    createdAt: "2026-03-20 10:00 AM",
    status: "Upcoming"
  },
  {
    id: "NCW-002",
    startDate: "2026-05-01",
    endDate: "2026-05-02",
    reason: "May Day Celebration",
    createdBy: "Admin Sarah",
    createdAt: "2026-04-15 02:30 PM",
    status: "Completed"
  },
];

export default function NonCollectionWeeksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredData = mockData.filter((item) => {
    return (
      item.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Non-Collection Weeks"
        description="Schedule holiday weeks and special occasions where collections are suspended."
      >
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger>
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4" />
              Add Non-Collection Week
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-xl border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Schedule Suspension</DialogTitle>
              <DialogDescription>
                Define the time range and reason for suspending collections across all groups.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <NonCollectionForm onSuccess={() => setIsAddModalOpen(false)} onCancel={() => setIsAddModalOpen(false)} />
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
                placeholder="Search by reason or creator..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
               <CalendarDays className="h-4 w-4 text-primary" />
               <span className="text-xs font-bold text-primary">System-wide Suspensions</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Start Date</TableHead>
                  <TableHead className="font-bold text-foreground">End Date</TableHead>
                  <TableHead className="font-bold text-foreground">Reason</TableHead>
                  <TableHead className="font-bold text-foreground">Created By</TableHead>
                  <TableHead className="font-bold text-foreground">Created At</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                         <div className="flex items-center gap-2 font-bold text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            {item.startDate}
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 font-bold text-foreground">
                            <Calendar className="h-4 w-4 text-rose-500" />
                            {item.endDate}
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{item.reason}</span>
                            <Badge variant="outline" className={cn(
                              "w-fit text-[10px] mt-1 font-bold px-2",
                              item.status === "Upcoming" ? "border-emerald-500/50 text-emerald-600" : "border-slate-500/50 text-slate-500"
                            )}>
                               {item.status}
                            </Badge>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm font-medium">
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.createdBy}
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {item.createdAt}
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
                              <DropdownMenuLabel>Schedule Options</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4 text-primary" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-600">
                              <Edit2Icon className="h-4 w-4 " />
                              Edit Schedule
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Cancel Suspension
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic font-medium">
                       No non-collection weeks scheduled.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
