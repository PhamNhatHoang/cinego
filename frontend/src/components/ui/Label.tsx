"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={twMerge(
          "text-xs font-semibold text-muted-foreground select-none flex items-center gap-0.5",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-primary font-bold ml-0.5">*</span>}
      </label>
    );
  }
);

Label.displayName = "Label";
export default Label;
