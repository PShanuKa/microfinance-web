"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientForm } from "@/components/Custom/ClientForm";

export default function NewClientPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-5xl mx-auto">
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
              <h1 className="text-3xl font-black tracking-tighter text-slate-900">Register New Client</h1>
              <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
                <UserPlus className="h-5 w-5" />
              </div>
           </div>
           <p className="text-sm text-muted-foreground font-semibold">
              Add a new member to the microfinance system with all required documents.
           </p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b bg-muted/10 p-8">
           <CardTitle className="text-xl font-bold">Client Registration Form</CardTitle>
           <CardDescription className="text-sm font-medium">Please fill in the personal details and upload the necessary identification documents.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
           <ClientForm 
             onSuccess={() => router.push("/clients")} 
             onCancel={() => router.back()} 
           />
        </CardContent>
      </Card>
    </div>
  );
}
