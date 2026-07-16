"use client";

import React from "react";
import { Popcorn } from "@phosphor-icons/react";
import Button from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 min-h-[300px] space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-muted-foreground select-none">
        {icon || <Popcorn size={32} weight="light" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-extrabold tracking-tight text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground max-w-[35ch] leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
