"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  options: TabOption[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  variant?: "pills" | "line";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeTabId,
  onTabChange,
  variant = "pills",
  className = "",
}) => {
  const baseListStyles = "flex items-center gap-1 overflow-x-auto scrollbar-none select-none";
  
  const listVariants = {
    pills: "p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-border/80 w-fit",
    line: "border-b border-border w-full gap-6 px-1",
  };

  const baseItemStyles = "inline-flex items-center justify-center font-bold text-xs transition-all duration-300 gap-1.5 focus:outline-none";

  const getItemStyles = (isActive: boolean) => {
    if (variant === "pills") {
      return clsx(
        "px-4 py-2 rounded-xl hover:scale-[1.01] active:scale-[0.99]",
        isActive
          ? "bg-card text-foreground shadow-sm border border-border/60"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
      );
    } else {
      return clsx(
        "py-3.5 border-b-2 px-1 relative -bottom-[2px]",
        isActive
          ? "border-primary text-primary font-extrabold"
          : "border-transparent text-muted-foreground hover:text-foreground"
      );
    }
  };

  return (
    <div className={twMerge(clsx(baseListStyles, listVariants[variant], className))}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onTabChange(opt.id)}
          className={twMerge(clsx(baseItemStyles, getItemStyles(opt.id === activeTabId)))}
        >
          {opt.icon && <span className="flex shrink-0">{opt.icon}</span>}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Tabs;
