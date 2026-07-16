"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "md",
  fullScreen = false,
  className,
}) => {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const spinner = (
    <div
      className={twMerge(
        clsx(
          "animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent",
          "border-muted/40",
          sizes[size],
          className
        )
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-[1px]">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Loading;
