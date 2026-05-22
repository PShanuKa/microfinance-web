"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, UserCog, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientForm } from "@/components/Custom/ClientForm";
import { useClientQuery } from "@/services/clientApi";

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data, isLoading } = useClientQuery(id as string);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading client data...</p>
      </div>
    );
  }

  if (!data?.client) {
    return (
      <div className="text-center p-10">
        <p className="text-lg font-bold text-destructive">Client not found.</p>
        <Button onClick={() => router.push("/clients")} className="mt-4">Back to Clients</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()} 
          className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">Edit Client Profile</h1>
              <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
                <UserCog className="h-5 w-5" />
              </div>
           </div>
           <p className="text-sm text-muted-foreground font-semibold">
              Update personal information and manage documents for <span className="text-primary">{data.client.fullname}</span>.
           </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b bg-muted/10 p-8">
           <CardTitle className="text-xl font-bold">Edit Profile & Documents</CardTitle>
           <CardDescription className="text-sm font-medium">Modify existing information or upload updated documentation.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
           <ClientForm 
             initialData={data.client}
             onSuccess={() => router.push(`/clients/${id}`)} 
             onCancel={() => router.back()} 
           />
        </CardContent>
      </Card>
    </div>
  );
}
