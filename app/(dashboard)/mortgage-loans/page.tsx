"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/Custom/PageHeader";
import { MortgageLoanForm } from "@/components/Custom/MortgageLoanForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MortgageLoansPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect to general mortgage list or home after successful creation
    router.push("/");
  };

  const handleCancel = () => {
    // Navigate back to the previous dashboard page
    router.back();
  };

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      
      {/* Dynamic, visually premium breadcrumb page header */}
      <PageHeader
        title="Create Mortgage Loan"
        description="Establish a new asset-secured mortgage contract with real-time financial calculations and risk valuation metrics"
      >
        <Button 
          variant="outline" 
          onClick={handleCancel} 
          className="gap-2 border-primary/20 hover:bg-primary/5 h-11 px-5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </PageHeader>

      {/* Main dashboard content container card */}
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        <MortgageLoanForm 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>

    </div>
  );
}
