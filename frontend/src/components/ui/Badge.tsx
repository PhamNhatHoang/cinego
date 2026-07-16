"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "age-rating";
  ratingType?: string; // e.g., "P", "T13", "T16", "T18"
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  ratingType,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md font-mono select-none border";

  const getAgeRatingStyles = (rating: string) => {
    switch (rating.toUpperCase()) {
      case "P":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "T13":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "T16":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "T18":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const variants = {
    primary: "bg-primary text-white border-primary/20",
    secondary: "bg-muted text-muted-foreground border-border",
    outline: "bg-transparent text-foreground border-border",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    "age-rating": ratingType ? getAgeRatingStyles(ratingType) : "bg-muted text-foreground border-border",
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {ratingType || children}
    </span>
  );
};

export default Badge;
