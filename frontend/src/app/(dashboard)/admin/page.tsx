"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  CurrencyDollar, 
  Ticket, 
  FilmSlate, 
  TrendUp, 
  Clock, 
  MapPin 
} from "@phosphor-icons/react";
import { Card, Button, DataTable } from "@/components/ui";
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

// Mock revenue data over 7 days
const REVENUE_DATA = [
  { day: "Th 2", revenue: 5400000 },
  { day: "Th 3", revenue: 6800000 },
  { day: "Th 4", revenue: 4900000 },
  { day: "Th 5", revenue: 7200000 },
  { day: "Th 6", revenue: 9500000 },
  { day: "Th 7", revenue: 14200000 },
  { day: "CN", revenue: 18500000 }
];

// Mock tickets by cinema
const CINEMA_SALES_DATA = [
  { name: "Hùng Vương", sales: 420 },
  { name: "Landmark 81", sales: 380 },
  { name: "Tây Sơn", sales: 240 },
  { name: "Vincom ĐN", sales: 180 }
];

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [dbBookings, setDbBookings] = useState<any[]>([]);

  // Prevent SSR hydration mismatch for Recharts
  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("cinego_bookings");
    if (saved) {
      setDbBookings(JSON.parse(saved));
    }
  }, []);

  // Compute live statistics based on localStorage bookings
  const liveStats = useMemo(() => {
    const totalBookedRevenue = dbBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const totalBookedTicketsCount = dbBookings.reduce((sum, b) => sum + (b.seats ? b.seats.split(",").length : 0), 0);

    return {
      totalRevenue: 66500000 + totalBookedRevenue,
      totalTickets: 1240 + totalBookedTicketsCount
    };
  }, [dbBookings]);

  const stats = [
    {
      label: "Doanh thu (Tháng)",
      value: `${liveStats.totalRevenue.toLocaleString("vi-VN")} đ`,
      trend: "+14.8% so với tháng trước",
      icon: <CurrencyDollar size={22} weight="duotone" className="text-green-500" />
    },
    {
      label: "Vé đã bán",
      value: `${liveStats.totalTickets} vé`,
      trend: "Tỷ lệ lấp đầy: 72.4%",
      icon: <Ticket size={22} weight="duotone" className="text-primary" />
    },
    {
      label: "Phim hoạt động",
      value: "6 phim",
      trend: "2 phim sắp chiếu",
      icon: <FilmSlate size={22} weight="duotone" className="text-indigo-500" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-border/60 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tổng quan Hệ Thống
          </h1>
          <p className="text-xs text-muted-foreground">
            Thống kê doanh số, vé bán và tình hình vận hành các rạp thời gian thực
          </p>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} variant="flat" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
                {stat.icon}
              </div>
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

      {/* Visual Chart Analysis (Only on mount to avoid SSR errors) */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Area chart: Revenue trend */}
          <Card variant="flat" className="p-6 space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Doanh thu tuần này (VND)
              </h4>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          {/* Bar chart: Cinema ticket sales */}
          <Card variant="flat" className="p-6 space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Lượng vé theo Rạp (Tuần này)
              </h4>
            </div>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CINEMA_SALES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

      {/* Live Recent Activities Log */}
      <Card variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
        <div className="flex justify-between items-center border-b border-border/60 pb-4">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Giao dịch vé gần đây
          </h2>
          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-extrabold tracking-widest uppercase">
            Live updates
          </span>
        </div>

        <div className="space-y-4 divide-y divide-border/60">
          {dbBookings.length > 0 ? (
            dbBookings.slice(0, 4).map((b, idx) => (
              <div key={b.id} className="flex justify-between items-center pt-4 first:pt-0">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-foreground">Giao dịch #{b.id}</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Khách đặt: <span className="text-foreground font-semibold">Pham Nhat Hoang</span>
                    {" • "}
                    Mua vé phim <span className="text-foreground font-bold">{b.movieTitle}</span> ({b.seats})
                  </p>
                </div>
                <div className="text-xs font-mono font-extrabold text-primary shrink-0 pl-4">
                  +{b.totalPrice.toLocaleString("vi-VN")} đ
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
