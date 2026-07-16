"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Key, ShieldWarning } from "@phosphor-icons/react";
import { Button, Card } from "@/components/ui";

export default function UnauthorizedPage() {
  return (
    <div className="space-y-6 max-w-[400px] mx-auto text-center py-6">
      {/* Visual Indicator Icon */}
      <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center select-none shadow-lg shadow-red-500/5 animate-pulse">
        <ShieldWarning size={32} weight="duotone" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Truy Cập Bị Từ Chối
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bạn không có quyền truy cập vào khu vực nghiệp vụ này. Vui lòng kiểm tra lại quyền tài khoản hoặc đăng nhập lại.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 pt-2">
        <Link href="/login" className="block w-full">
          <Button variant="primary" className="w-full font-bold" leftIcon={<Key size={16} />}>
            Đăng nhập lại
          </Button>
        </Link>
        <Link href="/" className="block w-full">
          <Button variant="outline" className="w-full font-bold" leftIcon={<ArrowLeft size={16} />}>
            Quay lại trang chủ
          </Button>
        </Link>
      </div>

      {/* Helpful Hint Footer */}
      <div className="text-[10px] text-muted-foreground/80 border-t border-border/40 pt-4 font-mono leading-relaxed text-left space-y-1 bg-muted/20 p-3.5 rounded-xl border border-border/60">
        <p className="font-bold text-foreground">Gợi ý phân quyền CineGo:</p>
        <p>• Khách hàng → Đặt vé, Profile cá nhân.</p>
        <p>• Staff → Soát vé, Check-in đơn.</p>
        <p>• Admin → Quản lý dữ liệu phim, suất chiếu, rạp.</p>
      </div>
    </div>
  );
}
