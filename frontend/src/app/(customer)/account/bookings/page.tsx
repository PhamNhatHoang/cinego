"use client";

import Link from "next/link";
import { ClockCounterClockwise, ArrowUpRight } from "@phosphor-icons/react";

export default function BookingsHistoryPage() {
  const dummyBookings = [
    { id: "CG-98402-A", movie: "Captain America: Brave New World", time: "19:00 - 18/07/2026", cinema: "CineGo Hùng Vương", seats: "G9, G10", status: "Đã thanh toán" },
    { id: "CG-81204-B", movie: "Mufasa: The Lion King", time: "14:30 - 15/07/2026", cinema: "CineGo Hùng Vương", seats: "F5", status: "Đã hoàn thành" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <ClockCounterClockwise size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lịch Sử Đặt Vé</h1>
          <p className="text-xs text-muted-foreground">Theo dõi và xem mã QR check-in các vé xem phim của bạn</p>
        </div>
      </div>

      <div className="space-y-4">
        {dummyBookings.map((booking, index) => (
          <div 
            key={index}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-border bg-muted/20 gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded border border-border/60">
                  {booking.id}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  booking.status === "Đã thanh toán" 
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-muted-foreground/10 text-muted-foreground border border-border/40"
                }`}>
                  {booking.status}
                </span>
              </div>
              <h3 className="font-bold text-base leading-snug">{booking.movie}</h3>
              <p className="text-xs text-muted-foreground">{booking.time} • {booking.cinema} • Ghế: {booking.seats}</p>
            </div>

            <Link 
              href={`/account/bookings/${booking.id}`}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted group transition-all"
            >
              <span>Xem vé điện tử</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
