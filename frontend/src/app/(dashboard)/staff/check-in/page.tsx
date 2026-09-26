"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Scan, 
  ArrowLeft, 
  Warning, 
  CheckCircle, 
  QrCode,
  MapPin,
  Clock,
  Armchair,
  Check
} from "@phosphor-icons/react";
import { Input, Button, Card, ConfirmDialog } from "@/components/ui";
import { ticketApi } from "@/lib/api-services";
import type { Ticket } from "@/lib/types";

export default function CheckInPage() {
  const [manualCode, setManualCode] = useState("");
  const [searchResult, setSearchResult] = useState<Ticket | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [checkedInList, setCheckedInList] = useState<Ticket[]>([]);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchResult(null);

    const code = manualCode.trim();
    if (!code) return;

    setIsLoading(true);

    try {
      const ticket = await ticketApi.findByCode(code);
      setSearchResult(ticket);
    } catch (err: any) {
      setSearchError(err.message || "Mã vé không tồn tại trong hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!searchResult) return;
    setIsLoading(true);

    try {
      const updated = await ticketApi.checkIn(searchResult.ticketCode);
      setSearchResult(updated);
      setCheckedInList((prev) => [updated, ...prev]);
      setShowSuccessDialog(true);
    } catch (err: any) {
      setSearchError(err.message || "Lỗi khi soát vé.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Soát Vé & Check-in</h1>
          <p className="text-xs text-muted-foreground">Quét mã QR hoặc nhập mã vé thủ công để kiểm tra tính hợp lệ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Verify scanner & results */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="flat" className="p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-3">Quét mã soát vé</h3>

            <form onSubmit={handleVerifyCode} className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Nhập mã vé (ví dụ: TIX-XXXXXXXX)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="rounded-xl"
                  leftIcon={<QrCode size={18} />}
                />
              </div>
              <Button type="submit" variant="primary" isLoading={isLoading} className="px-6 font-bold shrink-0">
                Kiểm tra
              </Button>
            </form>

            {searchError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-2">
                <Warning size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{searchError}</p>
              </div>
            )}

            {searchResult && (
              <div className="border border-border/80 rounded-2xl overflow-hidden p-6 bg-muted/10 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-border/60 pb-4 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold bg-card border px-2 py-0.5 rounded-md text-foreground select-all uppercase">
                      Mã vé: {searchResult.ticketCode}
                    </span>
                    <h4 className="text-base font-black text-foreground">{searchResult.movieTitle}</h4>
                  </div>
                  <div>
                    {searchResult.status === "USED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 text-[10px] font-bold border border-yellow-500/20 uppercase tracking-wider select-none">
                        <Warning size={12} weight="bold" />
                        <span>Vé đã soát ({searchResult.checkedInAt ? new Date(searchResult.checkedInAt).toLocaleTimeString("vi-VN") : ""})</span>
                      </span>
                    ) : searchResult.status === "CANCELLED" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-wider select-none">
                        <Warning size={12} weight="bold" />
                        <span>Vé đã hủy</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider select-none">
                        <CheckCircle size={12} weight="bold" />
                        <span>Vé hợp lệ - Chờ check-in</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5">
                      <Clock size={14} className="text-primary shrink-0" />
                      <span>Giờ chiếu: <span className="font-mono text-foreground font-bold">
                        {new Date(searchResult.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(searchResult.startTime).toLocaleDateString("vi-VN")}
                      </span></span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>Rạp: <span className="text-foreground">{searchResult.cinemaName}</span></span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-1.5">
                      <Armchair size={14} className="text-primary shrink-0" />
                      <span>Ghế: <span className="font-mono text-primary font-black text-sm">{searchResult.seatName}</span></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Check size={14} className="text-primary shrink-0" />
                      <span>Phòng: <span className="text-foreground">{searchResult.auditoriumName}</span></span>
                    </p>
                  </div>
                </div>

                {searchResult.status === "VALID" && (
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

            {!searchResult && !searchError && (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl min-h-[220px] text-muted-foreground select-none relative overflow-hidden bg-muted/5">
                <Scan size={44} weight="light" className="text-muted-foreground/60" />
                <p className="text-xs font-bold mt-3 text-center">Đang sẵn sàng kết nối thiết bị quét...</p>
                <p className="text-[10px] text-muted-foreground/60 text-center mt-1">Nhập mã vé hoặc quét QR để hệ thống phân tích trạng thái đơn.</p>
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500/30 shadow-[0_0_10px_#ef4444] animate-[bounce_3s_infinite]" />
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Shift checked-in list */}
        <div>
          <Card variant="flat" className="p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider border-b border-border/60 pb-3">
              Lịch sử quét trong ca ({checkedInList.length})
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {checkedInList.length > 0 ? (
                checkedInList.map((log) => (
                  <div key={log.id} className="p-3 border border-border rounded-xl space-y-2.5 text-[11px] leading-relaxed bg-muted/20">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-foreground bg-card px-1.5 py-0.5 rounded border uppercase">{log.ticketCode}</span>
                      <span className="text-[9px] font-bold text-green-500 font-mono">
                        {log.checkedInAt ? new Date(log.checkedInAt).toLocaleTimeString("vi-VN") : ""}
                      </span>
                    </div>
                    <div className="font-bold text-foreground truncate">{log.movieTitle}</div>
                    <div className="text-muted-foreground">
                      Ghế: <span className="font-mono text-primary font-bold">{log.seatName}</span>
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
