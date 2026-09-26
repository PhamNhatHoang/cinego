"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Calendar, MapPin, Armchair, CreditCard, CheckCircle } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { Card, Button, Loading, EmptyState } from "@/components/ui";
import { bookingApi } from "@/lib/api-services";
import type { Booking } from "@/lib/types";

export default function BookingDetailPage({ params }: { params: { bookingId: string } }) {
  const router = useRouter();
  const { bookingId } = params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingApi
      .getById(Number(bookingId))
      .then(setBooking)
      .catch(() => setBooking(null))
      .finally(() => setIsLoading(false));
  }, [bookingId]);

  if (isLoading) {
    return <Loading size="lg" className="py-20" />;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <EmptyState
          title="Không tìm thấy vé"
          description="Rất tiếc, không tìm thấy thông tin vé với mã đơn hàng này."
          actionText="Quay lại lịch sử"
          onAction={() => router.push("/account/bookings")}
        />
      </div>
    );
  }

  const isPaid = booking.status === "PAID";
  const showtimeTime = new Date(booking.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const showtimeDate = new Date(booking.startTime).toLocaleDateString("vi-VN");
  const createdAt = new Date(booking.createdAt).toLocaleString("vi-VN");
  const seatsDisplay = (booking.seatNames || []).join(", ");
  const qrData = booking.tickets?.[0]?.ticketCode || booking.bookingCode || `CG-${bookingId}`;

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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Chi Tiết Vé Điện Tử</h1>
          <p className="text-xs text-muted-foreground">Mã đơn vé: {booking.bookingCode}</p>
        </div>
      </div>

      {/* Ticket Layout Card */}
      <div className="flex flex-col items-center py-4">
        <div className="w-full max-w-[450px] bg-card border border-border rounded-3xl overflow-hidden shadow-xl relative">
          <div className="h-2.5 bg-primary w-full" />
          
          <div className="p-8 space-y-8 flex flex-col items-center text-center">
            {/* Payment status badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border select-none uppercase tracking-wider ${
              isPaid 
                ? "bg-green-500/10 text-green-500 border-green-500/20" 
                : booking.status === "CANCELLED" 
                  ? "bg-red-500/10 text-red-500 border-red-500/20" 
                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            }`}>
              <CheckCircle size={12} weight="bold" />
              <span>{isPaid ? "Giao dịch thành công" : booking.status === "CANCELLED" ? "Đã hủy" : "Đang chờ"}</span>
            </div>

            {/* QR Code section */}
            <div className="space-y-2.5 flex flex-col items-center select-none">
              <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-md">
                <QRCodeSVG value={qrData} size={160} level="H" includeMargin={false} />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground select-text uppercase">
                {qrData}
              </span>
            </div>

            {/* Movie metadata */}
            <div className="space-y-2 border-b border-border/60 pb-6 w-full text-center">
              <h2 className="text-lg font-black tracking-tight text-foreground leading-tight">{booking.movieTitle}</h2>
              <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <Calendar size={12} />
                <span className="font-mono">{showtimeTime} - {showtimeDate}</span>
              </p>
              <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1">
                <MapPin size={12} />
                <span>{booking.cinemaName}</span>
              </p>
              <p className="text-xs font-extrabold text-primary flex items-center justify-center gap-1 pt-1.5">
                <Armchair size={14} />
                <span>Ghế: <span className="font-mono font-bold">{seatsDisplay}</span></span>
              </p>
            </div>

            {/* Ticket summary */}
            <div className="w-full space-y-3.5 text-xs font-semibold text-muted-foreground">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Tổng tiền vé:</span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {Number(booking.totalAmount).toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Trạng thái:</span>
                <span className="text-foreground">{isPaid ? "Đã thanh toán" : booking.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Thời gian đặt:</span>
                <span className="text-foreground font-mono font-medium">{createdAt}</span>
              </div>
            </div>
          </div>

          {/* Ticket notch cutouts */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-background border-r border-border" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-background border-l border-border" />
        </div>

        {/* Navigation actions */}
        <div className="flex items-center gap-4 mt-8 w-full max-w-[450px]">
          <Link href="/account/bookings" className="flex-1">
            <Button variant="outline" className="w-full font-bold">Xem lịch sử</Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="primary" className="w-full font-bold">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
