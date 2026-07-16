"use client";

import { UserCircle } from "@phosphor-icons/react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <UserCircle size={64} weight="light" className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hồ Sơ Cá Nhân</h1>
          <p className="text-xs text-muted-foreground">Quản lý thông tin bảo mật và liên hệ của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Họ và tên</label>
          <div className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-medium">
            Pham Nhat Hoang
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Email</label>
          <div className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-medium">
            hoangpn@example.com
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Số điện thoại</label>
          <div className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-medium">
            +84 987 654 321
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground">Loại thành viên</label>
          <div className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm font-medium text-primary">
            Gold Member
          </div>
        </div>
      </div>
    </div>
  );
}
