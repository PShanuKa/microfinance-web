"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreVertical,
  Search,
  Filter,
  Briefcase,
  Users,
  Phone,
  CreditCard,
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
import { FormModal } from "@/components/Custom/FormModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { ClientViewModal } from "@/components/Custom/ClientViewModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit2, Trash2 } from "lucide-react";

const clientsData = [
  {
    id: "C-001",
    name: "Anura Kumara",
    nic: "741234567V",
    phone: "0771234567",
    job: "Government Teacher",
    guarantors: 2,
    status: "Active",
  },
  {
    id: "C-002",
    name: "Sunil Perera",
    nic: "823456789V",
    phone: "0719876543",
    job: "Shop Owner",
    guarantors: 1,
    status: "Active",
  },
  {
    id: "C-003",
    name: "Nimal Siri",
    nic: "651122334V",
    phone: "0755566778",
    job: "Unemployed",
    guarantors: 0,
    status: "Blacklisted",
  },
  {
    id: "C-004",
    name: "Kamal Gunarathne",
    nic: "901239876V",
    phone: "0723344556",
    job: "Driver",
    guarantors: 2,
    status: "Active",
  },
  {
    id: "C-005",
    name: "Saman Kumara",
    nic: "786543210V",
    phone: "0781122334",
    job: "Security Officer",
    guarantors: 1,
    status: "Active",
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-3 w-full md:px-4">
      <PageHeader
        title="Clients"
        description="Manage client profiles, guarantors, and documents"
      >
        <FormModal
          trigger={
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4" />
              New Client
            </div>
          }
        />
      </PageHeader>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
            <div className="relative flex-1 w-full max-md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or NIC..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-11 bg-background/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Clients</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                  <TableHead className="w-[200px] font-bold text-foreground">
                    Client
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    ID Number
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Phone
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Job
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Guarantors
                  </TableHead>
                  <TableHead className="font-bold text-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-bold text-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {client.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {client.id}
                          </span>
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
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                          {client.job}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(Math.min(client.guarantors, 3))].map(
                              (_, i) => (
                                <div
                                  key={i}
                                  className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold"
                                >
                                  G{i + 1}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === "Active"
                              ? "default"
                              : "destructive"
                          }
                          className={cn(
                            "font-bold px-3 py-1 rounded-full",
                            client.status === "Active"
                              ? "bg-emerald-500 hover:bg-emerald-600"
                              : "bg-rose-500 hover:bg-rose-600",
                          )}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div
                              // // variant="ghost"
                              // size="icon"
                              className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-card/95 backdrop-blur-md"
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewClient(client)}
                              className="gap-2 cursor-pointer"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClient(client)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4 " />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No clients found matching your search criteria.
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

      <FormModal
        trigger={<div className="hidden" />}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        // Note: For actual edit, you'd pass the client data to pre-fill
      />
    </div>
  );
}
