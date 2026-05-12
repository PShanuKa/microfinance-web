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
      <DialogTrigger >
        {trigger || (
          <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-4 w-4" />
            Add New Client
          </div>
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
