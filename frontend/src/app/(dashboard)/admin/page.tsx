"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CurrencyDollar, 
  Ticket, 
  FilmSlate, 
  TrendUp, 
  Clock, 
  MapPin 
} from "@phosphor-icons/react";
import { Card, Button, Loading } from "@/components/ui";
import { dashboardApi, bookingApi } from "@/lib/api-services";
import type { DashboardStats, Booking } from "@/lib/types";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [dashData, setDashData] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    Promise.all([
      dashboardApi.getStats(),
      bookingApi.getAll(),
    ])
      .then(([stats, bookings]) => {
        setDashData(stats);
        setRecentBookings(bookings.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !dashData) {
    return (
      <div className="flex justify-center py-20"><Loading size="lg" /></div>
    );
  }

  const stats = [
    {
      label: "Doanh thu (Tháng)",
      value: `${(dashData.totalRevenue || 0).toLocaleString("vi-VN")} đ`,
      trend: `${dashData.revenueGrowthPercent ? `+${dashData.revenueGrowthPercent.toFixed(1)}%` : "N/A"} so với tháng trước`,
      icon: <CurrencyDollar size={22} weight="duotone" className="text-green-500" />
    },
    {
      label: "Vé đã bán",
      value: `${dashData.totalTicketsSold || 0} vé`,
      trend: `Tỷ lệ lấp đầy: ${dashData.occupancyRate ? dashData.occupancyRate.toFixed(1) : "0"}%`,
      icon: <Ticket size={22} weight="duotone" className="text-primary" />
    },
    {
      label: "Phim hoạt động",
      value: `${dashData.activeMovies || 0} phim`,
      trend: `${dashData.upcomingMovies || 0} phim sắp chiếu`,
      icon: <FilmSlate size={22} weight="duotone" className="text-indigo-500" />
    }
  ];

  const weeklyRevenue = dashData.weeklyRevenue || [];
  const cinemaSales = dashData.cinemaSales || [];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tổng quan Hệ Thống</h1>
          <p className="text-xs text-muted-foreground">Thống kê doanh số, vé bán và tình hình vận hành các rạp thời gian thực</p>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="flat" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">{stat.icon}</div>
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">{stat.value}</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-0.5">
                <TrendUp size={12} />
                <span>{stat.trend}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card variant="flat" className="p-6 space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Doanh thu tuần này (VND)</h4>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="currentColor" className="opacity-50" />
                  <YAxis stroke="currentColor" className="opacity-50" tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip 
                    contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", color: "var(--foreground)" }} 
                    formatter={(v: any) => [`${v.toLocaleString()} VND`, "Doanh thu"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ef4444" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="flat" className="p-6 space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">Lượng vé theo Rạp (Tuần này)</h4>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cinemaSales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="currentColor" className="opacity-50" />
                  <YAxis stroke="currentColor" className="opacity-50" />
                  <Tooltip
                    contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", color: "var(--foreground)" }} 
                    formatter={(v: any) => [`${v} vé`, "Vé bán"]}
                  />
                  <Bar dataKey="sales" fill="#e11d48" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Transactions */}
      <Card variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
        <div className="flex justify-between items-center border-b border-border/60 pb-4">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">Giao dịch vé gần đây</h2>
          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-extrabold tracking-widest uppercase">Live updates</span>
        </div>

        <div className="space-y-4 divide-y divide-border/60">
          {recentBookings.length > 0 ? (
            recentBookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center pt-4 first:pt-0">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-foreground">Đơn #{b.bookingCode}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Phim <span className="text-foreground font-bold">{b.movieTitle}</span>
                    {" • "}
                    Ghế: <span className="font-mono text-primary font-bold">{(b.seatNames || []).join(", ")}</span>
                  </p>
                </div>
                <div className="text-xs font-mono font-extrabold text-primary shrink-0 pl-4">
                  +{Number(b.totalAmount).toLocaleString("vi-VN")} đ
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground font-medium">
              Chưa có giao dịch đặt vé nào được thực hiện gần đây.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
