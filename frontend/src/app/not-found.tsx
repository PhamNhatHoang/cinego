"use client";

import Link from "next/link";
import { ArrowLeft, Warning } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-24 flex flex-col justify-center items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <Warning size={32} weight="light" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight font-sans">
        404 - Không Tìm Thấy Trang
      </h1>
      <p className="text-muted-foreground max-w-[45ch] text-base leading-relaxed">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển sang địa chỉ khác. Vui lòng kiểm tra lại URL.
      </p>
      <div className="pt-6">
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>
    </main>
  );
}
