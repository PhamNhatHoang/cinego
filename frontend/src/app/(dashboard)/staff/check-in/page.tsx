"use client";

import { Scan } from "@phosphor-icons/react";

export default function StaffCheckInPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Scan size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Soát Vé & Check-in</h1>
          <p className="text-xs text-muted-foreground">Nhân viên quét mã QR hoặc nhập mã vé để cho khách hàng vào rạp</p>
        </div>
      </div>

      <div className="max-w-md p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-border">
        <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/80 p-6 space-y-4 shadow-soft">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="ticketCode">Mã Vé Điện Tử</label>
            <div className="flex gap-2">
              <input
                id="ticketCode"
                type="text"
                placeholder="Ví dụ: CG-98402-A"
                className="flex-1 px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm font-mono uppercase"
              />
              <button className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors">
                Xác nhận
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-xs font-semibold">HOẶC QUÉT MÃ QR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-xl bg-muted/20 gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <Scan size={28} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cho phép truy cập camera để bắt đầu quét mã QR từ điện thoại của khách hàng
            </p>
            <button className="px-4 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors">
              Mở Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
