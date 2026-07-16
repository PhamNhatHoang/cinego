"use client";

import Link from "next/link";
import { ArrowLeft, QrCode, Ticket } from "@phosphor-icons/react";

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Link href="/account/bookings" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chi Tiết Vé Điện Tử</h1>
          <p className="text-xs text-muted-foreground">Mã đơn vé: {params.bookingId}</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-6 text-center space-y-6">
        {/* Mock QR Code */}
        <div className="p-3 rounded-2xl bg-white border border-border shadow-lg">
          <div className="w-48 h-48 bg-slate-900 flex flex-col items-center justify-center text-white gap-2 rounded-xl">
            <QrCode size={64} weight="light" className="text-white opacity-80 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest">{params.bookingId}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Captain America: Brave New World</h2>
          <p className="text-sm text-muted-foreground">Suất chiếu: 19:00 - 18/07/2026</p>
          <p className="text-sm text-muted-foreground">Rạp: Phòng 3 - CineGo Hùng Vương</p>
          <p className="text-sm font-semibold text-primary">Ghế: G9, G10</p>
        </div>

        <div className="w-full max-w-sm p-4 rounded-xl border border-border/80 bg-muted/20 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng tiền vé:</span>
            <span className="font-bold">220,000 đ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phương thức:</span>
            <span className="font-medium">Mô phỏng Thanh toán</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Trạng thái:</span>
            <span className="text-green-500 font-bold">Đã thanh toán</span>
          </div>
        </div>
      </div>
    </div>
  );
}
