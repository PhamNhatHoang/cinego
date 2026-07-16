"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  const baseStyles = "animate-pulse bg-muted dark:bg-white/5 border border-border/10";

  const variants = {
    text: "h-4 w-full rounded-md",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    />
  );
};

export default Skeleton;
