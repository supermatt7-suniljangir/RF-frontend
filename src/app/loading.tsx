import React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      tiny: "size-8",
      small: "size-16",
      medium: "size-20",
      large: "size-24",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export default function Spinner({
  size = "large",
  show,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <div
      className={`${spinnerVariants({
        show,
      })} flex h-[85vh] w-full justify-center items-center`}
    >
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      {children}
    </div>
  );
}
