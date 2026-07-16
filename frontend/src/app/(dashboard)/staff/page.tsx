"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  IdentificationCard, 
  Scan, 
  Ticket, 
  CheckCircle, 
  Users, 
  ListChecks, 
  MonitorPlay 
} from "@phosphor-icons/react";
import { Card, Button } from "@/components/ui";

export default function StaffPage() {
  const [checkedInCount, setCheckedInCount] = useState(14);
  const [totalToday, setTotalToday] = useState(128);

  // Load bookings list count from local storage to keep it dynamic!
  useEffect(() => {
    const saved = localStorage.getItem("cinego_bookings");
    if (saved) {
      const bookings = JSON.parse(saved);
      // Let's add mock count to bookings length
      setTotalToday(128 + bookings.length);
    }
  }, []);

  const stats = [
    {
      title: "Đã Check-in hôm nay",
      value: `${checkedInCount} vé`,
      icon: <CheckCircle size={22} weight="duotone" className="text-green-500" />,
      desc: "Vé quét hợp lệ ca trực"
    },
    {
      title: "Tổng vé hôm nay",
      value: `${totalToday} vé`,
      icon: <Ticket size={22} weight="duotone" className="text-primary" />,
      desc: "Số lượng vé bán ra"
    },
    {
      title: "Hệ thống phòng chiếu",
      value: "Ổn định",
      icon: <MonitorPlay size={22} weight="duotone" className="text-indigo-500" />,
      desc: "4/4 phòng chiếu hoạt động"
    }
  ];

  const tasks = [
    { text: "Bật hệ thống máy chiếu & kiểm tra âm thanh Dolby Atmos", checked: true },
    { text: "Kiểm tra và chuẩn bị quầy bắp nước, nạp nguyên liệu", checked: true },
    { text: "Vệ sinh phòng chiếu phim 1 và 2 trước giờ công chiếu", checked: true },
    { text: "Hỗ trợ soát vé lối vào sảnh lớn giờ cao điểm (18:00 - 21:00)", checked: false },
    { text: "Bàn giao ca trực, kết toán tiền quầy nước cuối ngày", checked: false }
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <IdentificationCard size={24} weight="duotone" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tổng quan Nhân Viên
          </h1>
          <p className="text-xs text-muted-foreground">
            Quản lý hoạt động soát vé check-in và danh mục công việc trong ca trực
          </p>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="flat" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
              <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">{stat.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions & Tasks grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Actions panel (1 col) */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground pl-1">
            Nghiệp vụ nhanh
          </h3>
          <Card variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-foreground">Soát Vé Check-in</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Quét mã QR trên vé điện tử của khách hàng hoặc nhập mã số đơn vé trực tiếp để xác nhận soát vé.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/staff/check-in" className="block w-full">
                <Button variant="primary" className="w-full font-bold" leftIcon={<Scan size={16} />}>
                  Mở Máy Soát Vé
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Shift Tasks (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground pl-1 flex items-center gap-1">
            <ListChecks size={14} className="text-primary" />
            <span>Nhiệm vụ ca trực hôm nay</span>
          </h3>
          <Card variant="flat" className="p-6 space-y-4">
            <div className="divide-y divide-border/60">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
                  <input
                    type="checkbox"
                    checked={task.checked}
                    readOnly
                    className="w-4.5 h-4.5 rounded-lg border-border text-primary focus:ring-primary/20 accent-primary shrink-0 mt-0.5 cursor-not-allowed"
                  />
                  <span className={`text-xs font-medium leading-relaxed ${
                    task.checked ? "line-through text-muted-foreground" : "text-foreground"
                  }`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
