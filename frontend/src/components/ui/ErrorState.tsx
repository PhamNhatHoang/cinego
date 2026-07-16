"use client";

import React from "react";
import { Warning } from "@phosphor-icons/react";
import Button from "./Button";

export interface ErrorStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  retryText?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  icon,
  title = "Đã xảy ra lỗi",
  description = "Không thể tải dữ liệu vào lúc này. Vui lòng kiểm tra kết nối mạng và thử lại.",
  retryText = "Thử lại",
  onRetry,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 min-h-[300px] space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 select-none">
        {icon || <Warning size={32} weight="light" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-extrabold tracking-tight text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground max-w-[40ch] leading-relaxed">{description}</p>
      </div>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
