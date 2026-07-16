"use client";

import { Calendar } from "@phosphor-icons/react";

export default function AdminShowtimesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Calendar size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Suất Chiếu</h1>
          <p className="text-xs text-muted-foreground">Tạo lịch chiếu, thời gian bắt đầu và kết thúc của các bộ phim</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý Suất chiếu. Chờ triển khai thuật toán chống trùng lịch từ Thành viên 2.
      </div>
    </div>
  );
}
