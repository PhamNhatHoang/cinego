"use client";

import React, { useState, useEffect } from "react";
import { ChartBar, ArrowUp, Calendar, CurrencyDollar, FileText, DownloadSimple } from "@phosphor-icons/react";
import { Card, Button, Tabs } from "@/components/ui";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Revenue trend data
const MONTHLY_REVENUE_DATA = [
  { month: "T1", revenue: 45000000 },
  { month: "T2", revenue: 52000000 },
  { month: "T3", revenue: 38000000 },
  { month: "T4", revenue: 61000000 },
  { month: "T5", revenue: 78000000 },
  { month: "T6", revenue: 95000000 },
  { month: "T7", revenue: 128450000 }
];

// Ticket types sales distribution
const TICKET_TYPE_DATA = [
  { name: "Ghế Thường", value: 680, color: "#64748b" },
  { name: "Ghế VIP", value: 440, color: "#f59e0b" },
  { name: "Ghế Đôi (Couple)", value: 120, color: "#ec4899" }
];

export default function AdminReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeRange, setActiveRange] = useState("month");

  useEffect(() => {
    setMounted(true);
  }, []);

  const reportStats = [
    { label: "Doanh thu chu kỳ", value: "128,450,000 đ", diff: "+12.5%", color: "text-green-500" },
    { label: "Số lượng đơn vé", value: "1,240 đơn", diff: "+8.4%", color: "text-green-500" },
    { label: "Giá trị đơn trung bình", value: "103,500 đ", diff: "+3.8%", color: "text-green-500" },
    { label: "Tỷ lệ lấp đầy rạp", value: "72.4%", diff: "+5.1%", color: "text-green-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Header block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <ChartBar size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo Cáo Thống Kê</h1>
            <p className="text-xs text-muted-foreground">Phân tích chuyên sâu về doanh thu, loại vé bán và hiệu quả kinh doanh</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<DownloadSimple size={16} />}>
            Xuất Báo Cáo (PDF/Excel)
          </Button>
        </div>
      </div>

      {/* Reports statistics block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, idx) => (
          <Card key={idx} variant="flat" className="p-5 space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold font-mono">{stat.label}</span>
            <div className="text-xl font-black tracking-tight text-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500">
              <ArrowUp size={12} weight="bold" />
              <span>{stat.diff} so với chu kỳ trước</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts visualizations grid */}
      {mounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area Chart: Revenue Trend (2 cols) */}
          <div className="lg:col-span-2">
            <Card variant="flat" className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border/60 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Xu hướng doanh thu theo tháng (VND)
                </h4>
              </div>
              <div className="h-80 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="currentColor" className="opacity-50" />
                    <YAxis stroke="currentColor" className="opacity-50" tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", color: "var(--foreground)" }} 
                      formatter={(v: any) => [`${v.toLocaleString()} VND`, "Doanh thu"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ef4444" fillOpacity={1} fill="url(#colorRevM)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Pie Chart: Ticket Type distribution (1 col) */}
          <div>
            <Card variant="flat" className="p-6 space-y-4">
              <div className="border-b border-border/60 pb-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                  Tỷ lệ vé bán theo Hạng ghế
                </h4>
              </div>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TICKET_TYPE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {TICKET_TYPE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", color: "var(--foreground)" }} 
                      formatter={(v: any) => [`${v} vé`, "Lượng vé"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend list */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                {TICKET_TYPE_DATA.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                    <span className="text-foreground">{entry.value} vé ({((entry.value / 1240) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Exportable PDF details block */}
      <Card variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-primary" />
          <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Nhật ký ghi chú vận hành rạp
          </h4>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Báo cáo thống kê chu kỳ kinh doanh được tạo tự động vào 23:59 ngày cuối tháng. Số liệu phản ánh chính xác kết quả doanh thu phòng vé từ các kênh: Website đặt vé trực tuyến (84.2%), Mua vé trực tiếp tại quầy rạp (15.8%).
        </p>
      </Card>
    </div>
  );
}
