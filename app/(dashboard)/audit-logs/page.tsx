"use client";

import React, { useState } from "react";
import { 
  History, 
  Eye, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  User as UserIcon,
  Activity,
  Database
} from "lucide-react";
import { PageHeader } from "@/components/Custom/PageHeader";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useAuditLogsQuery } from "@/services/auditApi";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MyTable from "./Table";

export default function AuditLogsPage() {
 


  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader 
        title="Audit Logs" 
        description="Track system activities and data changes across the platform"
      />

      <MyTable />

      
    </div>
  );
}
