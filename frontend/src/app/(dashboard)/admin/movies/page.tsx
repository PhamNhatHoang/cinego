"use client";

import { FilmSlate } from "@phosphor-icons/react";

export default function AdminMoviesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <FilmSlate size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Phim</h1>
          <p className="text-xs text-muted-foreground">Thêm, Sửa, Xóa và phân loại các phim chiếu rạp</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý Danh sách phim. Chờ triển khai API CRUD từ Thành viên 1.
      </div>
    </div>
  );
}
