"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Search, 
  UserX, 
  Phone, 
  CreditCard, 
  AlertTriangle, 
  Calendar,
  Eye,
  UserCheck,
  Trash2,
  AlertCircle
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
import { ClientViewModal } from "@/components/Custom/ClientViewModal";

const blacklistData = [
  {
    id: "C-003",
    name: "Nimal Siri",
    nic: "651122334V",
    phone: "0755566778",
    reason: "Consistent non-payment and unreachable for 3 months.",
    lateWeeks: 12,
    date: "2026-01-15",
    job: "Unemployed",
    status: "Blacklisted",
    guarantor1: { name: "Jagath Siri", phone: "0715566778" },
    guarantor2: null
  },
  {
    id: "C-012",
    name: "Gunapala Silva",
    nic: "882345671V",
    phone: "0712233445",
    reason: "Fraudulent documentation provided during loan application.",
    lateWeeks: 4,
    date: "2026-03-22",
    job: "Laborer",
    status: "Blacklisted",
    guarantor1: { name: "Sunil Perera", phone: "0771234567" },
    guarantor2: { name: "Kamal Perera", phone: "0781234567" }
  },
];

export default function BlacklistPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredBlacklist = blacklistData.filter((client) => {
    return (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader
        title="Blacklist"
        description="View and manage clients who have been restricted from the system due to policy violations."
      />

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blacklisted clients..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="p-2 px-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold flex items-center gap-2">
               <AlertTriangle className="h-4 w-4" />
               Total: {blacklistData.length} Restricted Profiles
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 border-b">
                  <TableHead className="font-bold text-foreground">Client</TableHead>
                  <TableHead className="font-bold text-foreground">ID Number</TableHead>
                  <TableHead className="font-bold text-foreground">Phone</TableHead>
                  <TableHead className="font-bold text-foreground">Late Weeks</TableHead>
                  <TableHead className="font-bold text-foreground">Reason</TableHead>
                  <TableHead className="font-bold text-foreground">Blacklist Date</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlacklist.length > 0 ? (
                  filteredBlacklist.map((client) => (
                    <TableRow key={client.id} className="hover:bg-rose-500/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                           <span className="font-bold text-foreground group-hover:text-rose-600 transition-colors">{client.name}</span>
                           <span className="text-xs text-muted-foreground">{client.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                           {client.nic}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                           <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                           {client.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-black text-rose-600">
                           <AlertCircle className="h-3.5 w-3.5" />
                           {client.lateWeeks} Weeks
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px] text-xs text-muted-foreground leading-relaxed italic">
                           "{client.reason}"
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
                           <Calendar className="h-3.5 w-3.5" />
                           {client.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger >
                            <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-md">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Blacklist Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(client)} className="gap-2 cursor-pointer">
                              <Eye className="h-4 w-4 text-primary" />
                              View Full Profile & Guarantors
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-emerald-600 cursor-pointer">
                              <UserCheck className="h-4 w-4" />
                              Remove from Blacklist
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                      No blacklisted clients found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClientViewModal 
        client={selectedClient} 
        open={isViewModalOpen} 
        onOpenChange={setIsViewModalOpen} 
      />
    </div>
  );
}

