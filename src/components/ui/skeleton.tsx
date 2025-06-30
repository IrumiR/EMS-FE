import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "grid";
  rows?: number;
  cols?: number;
  gap?: number;
  children?: ReactNode;
}

function Skeleton({
  className,
  variant = "default",
  rows = 3,
  cols = 1,
  gap = 4,
  children,
  ...props
}: SkeletonProps) {
  if (variant === "grid") {
    return (
      <div
        data-slot="skeleton-grid"
        className={cn("grid", `grid-cols-${cols}`, `gap-${gap}`, className)}
        {...props}
      >
        {children ||
          Array.from({ length: rows * cols }, (_, i) => (
            <div
              key={i}
              data-slot="skeleton"
              className="bg-accent animate-pulse rounded-md h-4"
            />
          ))}
      </div>
    );
  }

  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
