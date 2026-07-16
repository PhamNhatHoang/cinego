"use client";

import { Armchair } from "@phosphor-icons/react";

export default function AdminSeatsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Armchair size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Thiết Lập Sơ Đồ Ghế</h1>
          <p className="text-xs text-muted-foreground">Cấu hình loại ghế, số hàng, số cột cho từng phòng chiếu</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung thiết lập Sơ đồ ghế phòng chiếu. Chờ triển khai từ Thành viên 1 và 2.
      </div>
    </div>
  );
}
