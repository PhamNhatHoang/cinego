"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClockCounterClockwise, ArrowUpRight, Ticket } from "@phosphor-icons/react";
import { Badge, Button, Card, EmptyState, Loading } from "@/components/ui";
import { bookingApi } from "@/lib/api-services";
import type { Booking } from "@/lib/types";

export default function BookingsHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi
      .getMyBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <ClockCounterClockwise size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Lịch Sử Đặt Vé</h1>
          <p className="text-xs text-muted-foreground">Theo dõi và quản lý toàn bộ hóa đơn vé xem phim của bạn</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loading size="lg" /></div>
      ) : (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              const isPaid = booking.status === "PAID";
              const showtimeTime = new Date(booking.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
              const showtimeDate = new Date(booking.startTime).toLocaleDateString("vi-VN");
              
              return (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-border bg-card/45 hover:bg-muted/10 transition-all duration-300 gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-muted border border-border px-2 py-0.5 rounded-lg text-foreground select-all uppercase">
                        {booking.bookingCode}
                      </span>
                      <Badge variant={isPaid ? "success" : booking.status === "CANCELLED" ? "danger" : "secondary"}>
                        {isPaid ? "Đã thanh toán" : booking.status === "CANCELLED" ? "Đã hủy" : "Đang chờ"}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base leading-snug text-foreground">{booking.movieTitle}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Lịch: <span className="font-bold text-foreground/80 font-mono">{showtimeTime} - {showtimeDate}</span>
                        {" • "}
                        Rạp: <span className="font-bold text-foreground/80">{booking.cinemaName}</span>
                        {" • "}
                        Ghế: <span className="font-mono text-primary font-bold">{(booking.seatNames || []).join(", ")}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    <Link href={`/account/bookings/${booking.id}`} className="block w-full">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto" rightIcon={<ArrowUpRight size={14} />}>
                        Xem vé điện tử
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              icon={<Ticket size={32} weight="light" />}
              title="Lịch sử trống"
              description="Bạn chưa thực hiện giao dịch đặt vé nào trên hệ thống CineGo."
              actionText="Mua vé ngay"
              onAction={() => router.push("/movies")}
            />
          )}
        </div>
      )}
    </div>
  );
}
