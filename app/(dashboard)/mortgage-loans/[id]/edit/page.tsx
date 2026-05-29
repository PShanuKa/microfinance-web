"use client";

import React from "react";
import { ArrowLeft, Edit3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { MortgageLoanForm } from "@/components/Custom/MortgageLoanForm";
import { useMortgageLoanQuery } from "@/services/mortgageLoanApi";

export default function MortgageLoanEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading, isError } = useMortgageLoanQuery(id as string);
  const mortgage = data?.mortgage;

  const isNotEditable = mortgage?.status && mortgage.status !== "DRAFT" && mortgage.status !== "PENDING";

  const handleSuccess = () => {
    // Redirect back to details page on successful update
    router.push(`/mortgage-loans/${id}`);
  };

  const handleCancel = () => {
    // Navigate back to details or dashboard list
    router.back();
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center font-medium animate-pulse text-slate-500">
        Loading mortgage loan details for editing...
      </div>
    );
  }

  if (isError || !mortgage) {
    return (
      <div className="p-10 text-center font-medium text-rose-500">
        Failed to fetch mortgage details. Please verify the ID and try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      
      {/* Edit Header */}
      <div className="flex items-center gap-4 text-left">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
              <Edit3 className="w-7 h-7 text-primary" /> Edit Mortgage Loan Agreement
            </h1>
          </div>
          <p className="text-sm text-muted-foreground font-semibold">
            Modifying agreement contract <strong className="text-slate-800 font-bold">{mortgage.loanNo}</strong> for client <strong className="text-slate-800 font-bold">{mortgage.client?.fullname}</strong>
          </p>
        </div>
      </div>

      {isNotEditable && (
        <div className="bg-rose-500/10 border-2 border-rose-500/50 text-rose-600 font-black p-4 rounded-xl flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300 shadow-xl shadow-rose-500/10">
          <AlertCircle className="w-6 h-6 text-rose-600 animate-pulse" /> 
          This mortgage loan is {mortgage.status} and cannot be edited.
        </div>
      )}

      {/* Render the pre-populated Form */}
      <Card className={`border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden p-2 ${isNotEditable ? "opacity-60 pointer-events-none grayscale-[0.2]" : ""}`}>
        <CardContent className="p-4 md:p-6">
          <MortgageLoanForm
            loanId={id as string}
            initialData={mortgage}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>

    </div>
  );
}
