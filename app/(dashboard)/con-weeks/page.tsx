"use client";

import React, { useState } from "react";
import { 
  CalendarDays,
  Clock,
  Plus,
  MoreVertical,
  Eye,
  UserPen,
  Trash2,
  CalendarRange,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  useNonCollectionWeeksQuery, 
  useDeleteNonCollectionWeekMutation 
} from "@/services/nonCollectionWeekApi";
import { NonCollectionWeekForm } from "@/components/Custom/NonCollectionWeekForm";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RoleGate } from "@/components/Custom/RoleGate";

export default function ConWeeksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNonCollectionWeeksQuery();
  const deleteMutation = useDeleteNonCollectionWeekMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<any>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    setSelectedWeek(null);
    setIsReadOnly(false);
    setIsFormOpen(true);
  };

  const handleEdit = (week: any) => {
    setSelectedWeek(week);
    setIsReadOnly(false);
    setIsFormOpen(true);
  };

  const handleView = (week: any) => {
    setSelectedWeek(week);
    setIsReadOnly(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this non-collection week?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredWeeks = data?.weeks?.filter((week: any) => 
    week.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    format(new Date(week.startDate), "MMMM").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (endDate: string) => {
    const isPast = new Date(endDate) < new Date();
    return (
      <Badge className={cn(
        "border-none px-3 py-1 rounded-full font-bold text-white", 
        isPast ? "bg-slate-500" : "bg-emerald-500 hover:bg-emerald-600"
      )}>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {isPast ? "PAST" : "ACTIVE"}
        </div>
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Non-Collection Weeks"
        description="Manage holiday weeks and scheduled collection pauses"
      >
        <RoleGate allowedRoles={["ADMIN"]}>

        <Button 
          onClick={handleCreate}
          className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
          <Plus className="h-4 w-4" />
          New Configuration
        </Button>
          </RoleGate>
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reason or month..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
               <Badge variant="outline" className="font-bold bg-background/50 px-4 py-2 rounded-lg border-input/50 text-muted-foreground">
                  {filteredWeeks?.length || 0} Records Found
               </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Week Window</TableHead>
                  <TableHead className="font-bold text-foreground">Reason / Description</TableHead>
                  <TableHead className="font-bold text-foreground">Cycle Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Syncing data...</TableCell>
                  </TableRow>
                ) : filteredWeeks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">No configurations found.</TableCell>
                  </TableRow>
                ) : (
                  filteredWeeks?.map((week: any) => (
                    <TableRow key={week.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {format(new Date(week.startDate), "MMM d")} - {format(new Date(week.endDate), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">Monday to Sunday Cycle</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <CalendarRange className="h-3.5 w-3.5" />
                          {week.reason || "Scheduled Pause"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(week.endDate)}
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
                              <DropdownMenuLabel>Week Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(week)} className="gap-2 cursor-pointer">
                              <Eye className="w-4 h-4 text-primary" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(week)} className="gap-2 cursor-pointer">
                              <UserPen className="w-4 h-4 text-blue-500" /> Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(week.id)} className="gap-2 cursor-pointer text-rose-500 focus:text-rose-600">
                              <Trash2 className="w-4 h-4" /> Delete Week
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isReadOnly ? "Week Details" : selectedWeek ? "Edit Week Configuration" : "Initialize Non-Collection Week"}
            </DialogTitle>
          </DialogHeader>
          <NonCollectionWeekForm 
            initialData={selectedWeek} 
            isReadOnly={isReadOnly}
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
