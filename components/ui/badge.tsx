import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-primary text-on-primary",
        blinding:  "bg-tertiary text-on-tertiary",
        glowing:   "bg-tertiary-container text-on-tertiary-container",
        dewy:      "bg-secondary-container text-on-secondary-container",
        matte:     "bg-surface-container text-on-surface-variant",
        discount:  "bg-primary text-on-primary",
        pending:   "bg-tertiary-container text-on-tertiary-container",
        approved:  "bg-secondary-container text-on-secondary-container",
        rejected:  "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
