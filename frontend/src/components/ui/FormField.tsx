"use client";

import React from "react";
import { Label } from "./Label";

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  className = "",
  children,
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">{children}</div>
      {error && (
        <span className="text-[11px] font-medium text-red-500 block pl-1 transition-all duration-300">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
