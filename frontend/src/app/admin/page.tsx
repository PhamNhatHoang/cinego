"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  PresentationChart,
  FilmSlate,
  FilmReel,
  Calendar,
  Ticket,
  Users,
  Compass
} from "@phosphor-icons/react";

export default function AdminDashboardPage() {
  const adminModules = [
    { name: "Quản lý Phim", href: "/admin/movies", icon: <FilmSlate size={20} /> },
    { name: "Quản lý Rạp Chiếu", href: "/admin/cinemas", icon: <Compass size={20} /> },
    { name: "Quản lý Phòng Chiếu", href: "/admin/auditoriums", icon: <FilmReel size={20} /> },
    { name: "Quản lý Suất Chiếu", href: "/admin/showtimes", icon: <Calendar size={20} /> },
    { name: "Quản lý Đơn Vé", href: "/admin/bookings", icon: <Ticket size={20} /> },
    { name: "Quản lý Người Dùng", href: "/admin/users", icon: <Users size={20} /> },
  ];

  return (
    <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-16 md:py-24 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            ADMINISTRATOR
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="text-muted-foreground text-sm">
            Hệ thống quản lý tài nguyên, suất chiếu và doanh thu CineGo.
          </p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-xs font-medium hover:bg-muted transition-colors">
          <ArrowLeft size={14} />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* Stats Cards (Double-Bezel Skeleton) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Doanh thu (Tháng)", value: "128,450,000 đ", trend: "+12.5% so với tháng trước" },
          { label: "Vé đã bán", value: "1,420 vé", trend: "Tỷ lệ lấp đầy ghế: 68%" },
          { label: "Phim đang chiếu", value: "8 phim", trend: "3 phim sắp khởi chiếu" }
        ].map((stat, idx) => (
          <div key={idx} className="p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-border">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/80 p-6 space-y-2">
              <span className="text-xs text-muted-foreground font-mono uppercase">{stat.label}</span>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-[11px] text-green-500 font-medium">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Management Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Danh Mục Quản Lý</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {adminModules.map((mod, idx) => (
            <Link 
              key={idx} 
              href={mod.href}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary group transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {mod.icon}
              </div>
              <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                {mod.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
