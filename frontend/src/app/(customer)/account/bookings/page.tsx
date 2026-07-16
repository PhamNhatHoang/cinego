"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClockCounterClockwise, ArrowUpRight, Ticket } from "@phosphor-icons/react";
import { Badge, Button, Card, EmptyState } from "@/components/ui";

interface Booking {
  id: string;
  showtimeId: string;
  movieTitle: string;
  showtimeTime: string;
  showtimeDate: string;
  cinemaName: string;
  cinemaAddress: string;
  seats: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function BookingsHistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Read from localStorage
    const saved = localStorage.getItem("cinego_bookings");
    let list: Booking[] = saved ? JSON.parse(saved) : [];

    // Fallback seed dummy data if empty to show something beautiful
    if (list.length === 0) {
      list = [
        {
          id: "CG-9840212",
          showtimeId: "s-103",
          movieTitle: "Captain America: Brave New World",
          showtimeTime: "19:00",
          showtimeDate: "2026-07-16",
          cinemaName: "CineGo Hùng Vương Plaza",
          cinemaAddress: "126 Hùng Vương, Quận 5, TP.HCM",
          seats: "G9, G10",
          totalPrice: 220000,
          paymentMethod: "Ví điện tử MoMo",
          paymentStatus: "SUCCESS",
          createdAt: "16/07/2026, 23:25:00",
        },
        {
          id: "CG-8120445",
          showtimeId: "s-203",
          movieTitle: "Mufasa: The Lion King",
          showtimeTime: "14:30",
          showtimeDate: "2026-07-16",
          cinemaName: "CineGo Landmark 81",
          cinemaAddress: "720A Điện Biên Phủ, Bình Thạnh, TP.HCM",
          seats: "F5, F6",
          totalPrice: 220000,
          paymentMethod: "Thẻ tín dụng",
          paymentStatus: "SUCCESS",
          createdAt: "15/07/2026, 14:00:15",
        },
      ];
      localStorage.setItem("cinego_bookings", JSON.stringify(list));
    }

    setBookings(list);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <ClockCounterClockwise size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Lịch Sử Đặt Vé
          </h1>
          <p className="text-xs text-muted-foreground">
            Theo dõi và quản lý toàn bộ hóa đơn vé xem phim của bạn
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const isCompleted = booking.paymentStatus === "SUCCESS";
            return (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-border bg-card/45 hover:bg-muted/10 transition-all duration-300 gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-muted border border-border px-2 py-0.5 rounded-lg text-foreground select-all uppercase">
                      {booking.id}
                    </span>
                    <Badge variant={isCompleted ? "success" : "secondary"}>
                      {isCompleted ? "Đã thanh toán" : "Đã hủy"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base leading-snug text-foreground">
                      {booking.movieTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Lịch: <span className="font-bold text-foreground/80 font-mono">{booking.showtimeTime} - {booking.showtimeDate}</span>
                      {" • "}
                      Rạp: <span className="font-bold text-foreground/80">{booking.cinemaName}</span>
                      {" • "}
                      Ghế: <span className="font-mono text-primary font-bold">{booking.seats}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <Link href={`/account/bookings/${booking.id}`} className="block w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      rightIcon={<ArrowUpRight size={14} />}
                    >
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
    </div>
  );
}
