"use client";

import { Ticket } from "@phosphor-icons/react";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Ticket size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Đơn Vé</h1>
          <p className="text-xs text-muted-foreground">Xem toàn bộ đơn vé, hủy vé và theo dõi tình trạng thanh toán</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý Hóa đơn đặt vé. Chờ triển khai API từ Thành viên 2.
      </div>
    </div>
  );
}
