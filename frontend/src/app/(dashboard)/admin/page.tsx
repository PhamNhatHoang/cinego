"use client";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">
          Tổng quan hệ thống
        </h1>
        <p className="text-muted-foreground text-sm">
          Dữ liệu thống kê lượt đặt vé, doanh thu và suất chiếu thời gian thực.
        </p>
      </div>

      {/* Stats Cards (Double-Bezel Layout) */}
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

      {/* Recent Activities (Double Bezel Layout) */}
      <div className="p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-border">
        <div className="rounded-[calc(2rem-0.5rem)] bg-card border border-border p-6 md:p-8 space-y-4 shadow-soft">
          <div className="flex justify-between items-center border-b border-border/60 pb-4">
            <h2 className="text-lg font-bold tracking-tight">Hoạt động đặt vé gần đây</h2>
            <span className="text-xs text-muted-foreground font-mono">LIVE UPDATES</span>
          </div>

          <div className="space-y-4 divide-y divide-border/60">
            {[
              { email: "user1@example.com", detail: "đã mua 2 vé phim 'Captain America'", time: "2 phút trước", amount: "220,000 đ" },
              { email: "user2@example.com", detail: "đã mua 1 vé phim 'Mufasa'", time: "15 phút trước", amount: "110,000 đ" },
              { email: "user3@example.com", detail: "đã mua 3 vé phim 'Captain America'", time: "1 giờ trước", amount: "330,000 đ" },
            ].map((activity, idx) => (
              <div key={idx} className="flex justify-between items-center pt-4 first:pt-0">
                <div>
                  <div className="text-sm font-semibold">{activity.email}</div>
                  <p className="text-xs text-muted-foreground">{activity.detail} • {activity.time}</p>
                </div>
                <div className="text-sm font-mono font-bold text-primary">{activity.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
