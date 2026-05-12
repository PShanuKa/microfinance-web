import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Search } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { SampleForm } from "@/components/Custom/SampleForm";

const sampleClients = [
  {
    id: "C-001",
    name: "Anura Kumara",
    nic: "741234567V",
    mobile: "0771234567",
    center: "Colombo North",
    status: "Active",
  },
  {
    id: "C-002",
    name: "Sunil Perera",
    nic: "823456789V",
    mobile: "0719876543",
    center: "Kaduwela",
    status: "Active",
  },
  {
    id: "C-003",
    name: "Nimal Siri",
    nic: "651122334V",
    mobile: "0755566778",
    center: "Malabe",
    status: "Inactive",
  },
  {
    id: "C-004",
    name: "Kamal Gunarathne",
    nic: "901239876V",
    mobile: "0723344556",
    center: "Battaramulla",
    status: "Active",
  },
  {
    id: "C-005",
    name: "Saman Kumara",
    nic: "786543210V",
    mobile: "0781122334",
    center: "Colombo South",
    status: "Active",
  },
];

export default function ComponentsDevPage() {
  return (
    <div className="flex flex-col gap-10 w-full mx-auto p-4 md:p-8 max-w-7xl">
      <div className="space-y-6">
        <PageHeader
          title="Clients Management"
          description="View and manage all registered clients, their NIC details, and center assignments."
        >
          <Button
            size="default"
            className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            New Client
          </Button>
        </PageHeader>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b bg-muted/30 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search clients by name or ID..."
                  className="w-full bg-background/50 pl-10 h-10 rounded-sm border border-input px-3 py-2 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                    <TableHead className="w-[120px] font-semibold">
                      Client ID
                    </TableHead>
                    <TableHead className="font-semibold">Full Name</TableHead>
                    <TableHead className="font-semibold">NIC Number</TableHead>
                    <TableHead className="font-semibold">Mobile</TableHead>
                    <TableHead className="font-semibold">Center</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleClients.map((client) => (
                    <TableRow
                      key={client.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <TableCell className="font-bold text-primary">
                        {client.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.nic}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {client.mobile}
                      </TableCell>
                      <TableCell>{client.center}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset",
                            client.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 ring-rose-500/20",
                          )}
                        >
                          <span
                            className={cn(
                              "mr-1.5 h-1.5 w-1.5 rounded-full",
                              client.status === "Active"
                                ? "bg-emerald-600"
                                : "bg-rose-600",
                            )}
                          />
                          {client.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 border-t bg-muted/20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <PageHeader
          title="Registration Form"
          description="A complete sample form using Shadcn components for data entry."
        />
        <div className="flex justify-center">
          <SampleForm />
        </div>
      </div>
    </div>
  );
}
