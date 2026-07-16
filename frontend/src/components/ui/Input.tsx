"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, type = "text", ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center pointer-events-none group-focus-within:text-primary transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={twMerge(
            clsx(
              "w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none transition-all duration-300",
              "border-border placeholder:text-muted-foreground/60 text-foreground",
              "focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
              error && "border-red-500/80 focus:border-red-500 focus:ring-red-500/10",
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            ),
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
