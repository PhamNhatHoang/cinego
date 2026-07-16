"use client";

import Link from "next/link";
import { Scan, IdentificationCard } from "@phosphor-icons/react";

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <IdentificationCard size={32} weight="light" className="text-primary" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Khu Vực Nghiệp Vụ Nhân Viên</h1>
          <p className="text-xs text-muted-foreground">Chào mừng trở lại! Thực hiện các nghiệp vụ kiểm soát và phục vụ khách hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
        <Link 
          href="/staff/check-in"
          className="p-6 rounded-2xl border border-border bg-card hover:border-primary group transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <Scan size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Soát Vé & Check-in</h3>
            <p className="text-xs text-muted-foreground mt-1">Quét mã QR hoặc nhập mã vé thủ công để cho khách hàng vào phòng chiếu.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
