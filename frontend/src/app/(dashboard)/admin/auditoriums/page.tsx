"use client";

import { FilmReel } from "@phosphor-icons/react";

export default function AdminAuditoriumsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <FilmReel size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Phòng Chiếu</h1>
          <p className="text-xs text-muted-foreground">Quản lý danh sách các phòng chiếu phim thuộc cụm rạp</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý Phòng chiếu. Chờ triển khai API CRUD từ Thành viên 1.
      </div>
    </div>
  );
}
