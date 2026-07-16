"use client";

import { Users } from "@phosphor-icons/react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <Users size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Quản Lý Người Dùng</h1>
          <p className="text-xs text-muted-foreground">Quản lý tài khoản khách hàng, nhân viên và phân quyền hệ thống</p>
        </div>
      </div>
      <div className="p-8 border border-dashed border-border rounded-2xl text-center text-muted-foreground bg-card/50">
        Khung quản lý người dùng và phân quyền. Chờ triển khai từ Thành viên 1.
      </div>
    </div>
  );
}
