"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "@phosphor-icons/react";

export default function AdminCinemasPage() {
  return (
    <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-24 flex flex-col justify-center items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <Compass size={32} weight="light" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Rạp Chiếu</h1>
      <p className="text-muted-foreground max-w-[45ch]">
        Đây là giao diện khung của trang **Quản Lý Rạp Chiếu** (Thêm, Sửa, Xóa thông tin rạp). Thành viên 1 sẽ xây dựng chức năng kết nối API CRUD tại đây.
      </p>
      <div className="pt-6">
        <Link href="/admin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
          <span>Quay lại trang quản trị</span>
        </Link>
      </div>
    </main>
  );
}
