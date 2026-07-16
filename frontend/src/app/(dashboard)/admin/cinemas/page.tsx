"use client";

import { Compass } from "@phosphor-icons/react";

export default function AdminCinemasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Compass size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Rạp Chiếu</h1>
          <p className="text-xs text-muted-foreground">Quản lý hệ thống cụm rạp, địa chỉ và thông tin liên hệ</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý Danh sách Cụm rạp. Chờ triển khai API CRUD từ Thành viên 1.
      </div>
    </div>
  );
}
