"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "double-bezel" | "glass";
  innerClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  className,
  innerClassName,
  variant = "flat",
  children,
  ...props
}) => {
  if (variant === "double-bezel") {
    return (
      <div
        className={twMerge(
          "p-1.5 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-border shadow-soft dark:shadow-soft-dark",
          className
        )}
        {...props}
      >
        <div
          className={twMerge(
            "rounded-[calc(2rem-0.625rem)] bg-card border border-border/80 p-6 md:p-8 space-y-4",
            innerClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  const baseStyles = "rounded-2xl border border-border p-6 shadow-soft dark:shadow-soft-dark bg-card";
  
  const variants = {
    flat: "bg-card text-card-foreground",
    glass: "backdrop-blur-md bg-card/60 border-border text-foreground",
    "double-bezel": "", // Handled above
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
