// components/ui/common-button.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

// ── Variants define කරන්න ──────────────────────────────────────
const buttonVariants = cva(
  // Base styles (සියලු buttons-ට common)
  "inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        // shadcn defaults
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "text-primary underline-offset-4 hover:underline",

        // ✅ ඔබේ custom variants
        success:     "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
        error:       "bg-red-600    text-white hover:bg-red-700    focus-visible:ring-red-500",
        warning:     "bg-amber-500  text-white hover:bg-amber-600  focus-visible:ring-amber-400",
        info:        "bg-sky-500    text-white hover:bg-sky-600    focus-visible:ring-sky-400",
      },
      size: {
        sm:      "h-8  px-3 text-xs",
        default: "h-10 px-4",
        lg:      "h-12 px-6 text-base",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ── Props type ─────────────────────────────────────────────────
interface CommonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ── Component ──────────────────────────────────────────────────
export const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

