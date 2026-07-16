"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowClockwise, WarningOctagon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error tracking service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-24 flex flex-col justify-center items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <WarningOctagon size={32} weight="light" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight font-sans">
        Đã Xảy Ra Lỗi Hệ Thống
      </h1>
      <p className="text-muted-foreground max-w-[45ch] text-base leading-relaxed">
        Rất tiếc, đã có một sự cố xảy ra trong quá trình xử lý trang web. Vui lòng thử tải lại hoặc liên hệ với quản trị viên.
      </p>
      
      {error.message && (
        <pre className="p-4 rounded-lg bg-muted text-xs font-mono max-w-full overflow-x-auto text-left border border-border">
          <code>{error.message}</code>
        </pre>
      )}

      <div className="pt-4 flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <ArrowClockwise size={16} />
          <span>Thử lại</span>
        </button>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    </main>
  );
}
