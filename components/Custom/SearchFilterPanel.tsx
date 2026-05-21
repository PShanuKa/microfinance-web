"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface SearchFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export function SearchFilterPanel({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  children,
}: SearchFilterPanelProps) {
  const [openItem, setOpenItem] = useState<string[]>([]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center p-4 border-b bg-muted/20 gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-10 h-10 bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {children && (
          <div
            className={cn(
              "flex items-center gap-3 w-full md:w-auto cursor-pointer text-sm font-semibold transition-colors",
              openItem.includes("item-1") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() =>
              setOpenItem((prev) =>
                prev.includes("item-1") ? [] : ["item-1"],
              )
            }
          >
            filters
          </div>
        )}
      </div>

      {children && (
        <Accordion
          value={openItem}
          onValueChange={setOpenItem}
          className="w-full border-none"
        >
          <AccordionItem value="item-1" className="border-none">
            <AccordionContent className="px-4 py-4 border-b bg-muted/20">
              <div className="flex flex-col md:flex-row items-end gap-4">
                {children}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
