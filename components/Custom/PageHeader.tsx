import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2 md:py-4",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground transition-all duration-300 hover:translate-x-1 cursor-default">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground/80 font-medium max-w-[600px] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}
