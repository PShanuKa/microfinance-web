"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ClientForm } from "./ClientForm"
import { Plus } from "lucide-react"

interface FormModalProps {
  trigger?: React.ReactNode;
}

export function FormModal({ trigger }: FormModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add New Client
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Client Registration</DialogTitle>
          <DialogDescription>
            Enter the details of the new client. Click register when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ClientForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
