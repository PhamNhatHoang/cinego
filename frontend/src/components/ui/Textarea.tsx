"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={twMerge(
          clsx(
            "w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none transition-all duration-300 min-h-[80px]",
            "border-border placeholder:text-muted-foreground/60 text-foreground",
            "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
            error && "border-red-500/80 focus:border-red-500 focus:ring-red-500/10"
          ),
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
