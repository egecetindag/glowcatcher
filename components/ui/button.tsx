import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:opacity-90",
        glow: "bg-gradient-to-br from-primary to-primary-container text-on-primary hover:opacity-90 shadow-sm",
        "glow-outline": "border border-primary text-primary hover:bg-primary/8",
        secondary:
          "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        "secondary-outline":
          "border border-secondary text-secondary hover:bg-secondary/8",
        blinding: "bg-tertiary text-on-tertiary font-semibold",
        glowing: "bg-tertiary-container text-on-tertiary-container",
        dewy: "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80",
        matte:
          "bg-surface-container-low text-on-surface-variant hover:bg-surface-container",
        ghost: "hover:bg-surface-container text-on-surface-variant",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm: "h-7 px-3 text-xs",
        lg: "h-11 px-8 text-[14px]",
        pill: "h-7 px-4 text-xs rounded-full",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <i className="fi fi-rr-spinner animate-spin text-sm leading-none" />
          {props.children}
        </span>
      ) : (
        props.children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
