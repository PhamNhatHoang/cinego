"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Calendar, MapPin, Armchair, CreditCard, CheckCircle } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { Card, Button, Loading } from "@/components/ui";

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

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const { bookingId } = params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to load booking from localStorage
    const saved = localStorage.getItem("cinego_bookings");
    const bookings: Booking[] = saved ? JSON.parse(saved) : [];
    
    // Find matches
    const matched = bookings.find((b) => b.id === bookingId);

    if (matched) {
      setBooking(matched);
    } else {
      // Fallback fallback mock if not found (e.g. direct URL visit for testing)
      setBooking({
        id: bookingId,
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
        createdAt: new Date().toLocaleString("vi-VN"),
      });
    }

    setIsLoading(false);
  }, [bookingId]);

  if (isLoading) {
    return <Loading size="lg" className="py-20" />;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Không tìm thấy thông tin vé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Link
          href="/account/bookings"
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Chi Tiết Vé Điện Tử
          </h1>
          <p className="text-xs text-muted-foreground">Mã đơn vé: {booking.id}</p>
        </div>
      </div>

      {/* Ticket Layout Card */}
      <div className="flex flex-col items-center py-4">
        
        {/* Ticket Container */}
        <div className="w-full max-w-[450px] bg-card border border-border rounded-3xl overflow-hidden shadow-xl relative">
          
          {/* Top visual accent color bar */}
          <div className="h-2.5 bg-primary w-full" />
          
          {/* Main Info content */}
          <div className="p-8 space-y-8 flex flex-col items-center text-center">
            
            {/* Payment success badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 select-none uppercase tracking-wider">
              <CheckCircle size={12} weight="bold" />
              <span>Giao dịch thành công</span>
            </div>

            {/* QR Code section */}
            <div className="space-y-2.5 flex flex-col items-center select-none">
              <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-md">
                <QRCodeSVG
                  value={booking.id}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground select-text uppercase">
                {booking.id}
              </span>
            </div>

            {/* Movie metadata inside Ticket */}
            <div className="space-y-2 border-b border-border/60 pb-6 w-full text-center">
              <h2 className="text-lg font-black tracking-tight text-foreground leading-tight">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Calendar size={12} />
                <span className="font-mono">{booking.showtimeTime} - {booking.showtimeDate}</span>
              </p>
              <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <MapPin size={12} />
                <span>{booking.cinemaName}</span>
              </p>
              <p className="text-xs font-extrabold text-primary flex items-center justify-center gap-1 pt-1.5">
                <Armchair size={14} />
                <span>Ghế: <span className="font-mono font-bold">{booking.seats}</span></span>
              </p>
            </div>

            {/* Ticket details summary inside card */}
            <div className="w-full space-y-3.5 text-xs font-semibold text-muted-foreground">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Tổng tiền vé:</span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {booking.totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Phương thức:</span>
                <span className="text-foreground">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Thời gian đặt:</span>
                <span className="text-foreground font-mono font-medium">{booking.createdAt}</span>
              </div>
            </div>

          </div>

          {/* Ticket notch cutouts visual effect */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-background border-r border-border" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-background border-l border-border" />

        </div>

        {/* Outer navigation actions */}
        <div className="flex items-center gap-4 mt-8 w-full max-w-[450px]">
          <Link href="/account/bookings" className="flex-1">
            <Button variant="outline" className="w-full font-bold">
              Xem lịch sử
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full font-bold">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
