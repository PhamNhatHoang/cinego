"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Scan, 
  ArrowLeft, 
  Warning, 
  CheckCircle, 
  MagnifyingGlass,
  QrCode,
  MapPin,
  Clock,
  Armchair,
  Check
} from "@phosphor-icons/react";
import { Input, FormField, Button, Card, ConfirmDialog } from "@/components/ui";

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
  checkedIn?: boolean;
  checkedInAt?: string;
}

export default function CheckInPage() {
  const router = useRouter();
  const [manualCode, setManualCode] = useState("");
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  // Load all bookings from local storage
  const fetchLocalStorageBookings = () => {
    const saved = localStorage.getItem("cinego_bookings");
    if (saved) {
      setAllBookings(JSON.parse(saved));
    }
  };

  useEffect(() => {
    fetchLocalStorageBookings();
  }, []);

  // Filter list of checked-in bookings in this shift
  const checkedInList = useMemo(() => {
    return allBookings.filter((b) => b.checkedIn === true);
  }, [allBookings]);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchResult(null);

    const code = manualCode.trim().toUpperCase();
    if (!code) return;

    setIsLoading(true);

    // Simulate database lookup latency
    setTimeout(() => {
      const matched = allBookings.find((b) => b.id.toUpperCase() === code);

      if (matched) {
        setSearchResult(matched);
      } else {
        setSearchError("Mã vé không tồn tại trong hệ thống. Vui lòng thử lại.");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleConfirmCheckin = () => {
    if (!searchResult) return;

    setIsLoading(true);

    setTimeout(() => {
      // Update checkin status in local storage
      const updatedList = allBookings.map((b) => {
        if (b.id === searchResult.id) {
          return {
            ...b,
            checkedIn: true,
            checkedInAt: new Date().toLocaleTimeString("vi-VN"),
          };
        }
        return b;
      });

      localStorage.setItem("cinego_bookings", JSON.stringify(updatedList));
      setAllBookings(updatedList);
      
      // Update local search result state
      setSearchResult((prev) =>
        prev
          ? {
              ...prev,
              checkedIn: true,
              checkedInAt: new Date().toLocaleTimeString("vi-VN"),
            }
          : null
      );

      setIsLoading(false);
      setShowSuccessDialog(true);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Link
          href="/staff"
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Soát Vé & Check-in
          </h1>
          <p className="text-xs text-muted-foreground">
            Quét mã QR hoặc nhập mã đơn vé thủ công để kiểm tra tính hợp lệ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Verify scanner & results (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="flat" className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-3">
              Quét mã soát vé
            </h3>

            {/* Input code form */}
            <form onSubmit={handleVerifyCode} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Nhập mã vé thủ công (ví dụ: CG-9840212)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="rounded-xl"
                  leftIcon={<QrCode size={18} />}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="px-6 font-bold shrink-0"
              >
                Kiểm tra
              </Button>
            </form>

            {/* Error messaging */}
            {searchError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-2">
                <Warning size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{searchError}</p>
              </div>
            )}

            {/* Verification result card details */}
            {searchResult && (
              <div className="border border-border/80 rounded-2xl overflow-hidden p-6 bg-muted/10 space-y-6">
                
                {/* Result header banner */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-border/60 pb-4 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold bg-card border px-2 py-0.5 rounded-md text-foreground select-all uppercase">
                      Mã vé: {searchResult.id}
                    </span>
                    <h4 className="text-base font-black text-foreground">{searchResult.movieTitle}</h4>
                  </div>
                  <div>
                    {searchResult.checkedIn ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold border border-yellow-500/20 uppercase tracking-wider select-none">
                        <Warning size={12} weight="bold" />
                        <span>Vé đã soát ({searchResult.checkedInAt})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider select-none">
                        <CheckCircle size={12} weight="bold" />
                        <span>Vé hợp lệ - Chờ check-in</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Slot meta info details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary shrink-0" />
                      <span>Giờ chiếu: <span className="font-mono text-foreground font-bold">{searchResult.showtimeTime} - {searchResult.showtimeDate}</span></span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>Rạp: <span className="text-foreground">{searchResult.cinemaName}</span></span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5">
                      <Armchair size={14} className="text-primary shrink-0" />
                      <span>Ghế đã đặt: <span className="font-mono text-primary font-black text-sm">{searchResult.seats}</span></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Check size={14} className="text-primary shrink-0" />
                      <span>Người đặt: <span className="text-foreground">Pham Nhat Hoang</span></span>
                    </p>
                  </div>
                </div>

                {/* Confirm Action Button */}
                {!searchResult.checkedIn && (
                  <div className="pt-2">
                    <Button
                      onClick={handleConfirmCheckin}
                      variant="primary"
                      className="w-full py-2.5 font-bold text-sm"
                      leftIcon={<CheckCircle size={16} />}
                      isLoading={isLoading}
                    >
                      Xác Nhận Cho Vào Phòng Chiếu
                    </Button>
                  </div>
                )}

              </div>
            )}

            {/* Visual simulation scanner frame if empty search */}
            {!searchResult && !searchError && (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl min-h-[220px] text-muted-foreground select-none relative overflow-hidden bg-muted/5">
                <Scan size={44} weight="light" className="text-muted-foreground/60" />
                <p className="text-xs font-bold mt-3 text-center">Đang sẵn sàng kết nối thiết bị quét...</p>
                <p className="text-[10px] text-muted-foreground/60 text-center mt-1">Nhập mã vé hoặc quét QR để hệ thống phân tích trạng thái đơn.</p>
                {/* Red laser reader visual animation effect */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500/30 shadow-[0_0_10px_#ef4444] animate-[bounce_3s_infinite]" />
              </div>
            )}

          </Card>
        </div>

        {/* Right Side: Shift checked-in tickets list log (1 col) */}
        <div>
          <Card variant="flat" className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-3">
              Lịch sử quét trong ca ({checkedInList.length})
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {checkedInList.length > 0 ? (
                checkedInList.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border border-border rounded-xl space-y-2.5 text-[11px] leading-relaxed bg-muted/20"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-foreground bg-card px-1.5 py-0.5 rounded border uppercase">
                        {log.id}
                      </span>
                      <span className="text-[9px] font-bold text-green-500 font-mono">
                        Check-in: {log.checkedInAt}
                      </span>
                    </div>
                    <div className="font-bold text-foreground truncate">{log.movieTitle}</div>
                    <div className="text-muted-foreground">
                      Giờ: <span className="font-mono">{log.showtimeTime}</span>
                      {" • "}
                      Ghế: <span className="font-mono text-primary font-bold">{log.seats}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[11px] text-muted-foreground">
                  Chưa có vé nào được quét check-in trong ca trực này.
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Checkin successful modal */}
      <ConfirmDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={() => setShowSuccessDialog(false)}
        title="Check-in Thành Công!"
        message="Mã vé hợp lệ! Đã xác nhận soát vé thành công. Cho phép khách hàng di chuyển vào phòng chiếu phim."
        confirmText="Hoàn thành"
        cancelText="Đóng"
      />
    </div>
  );
}
