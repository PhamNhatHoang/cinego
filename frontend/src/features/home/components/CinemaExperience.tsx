"use client";

import { Armchair, ShieldCheck, Ticket, Sparkle } from "@phosphor-icons/react";

export default function CinemaExperience() {
  const experiences = [
    {
      title: "Chọn Ghế Trực Quan",
      desc: "Sơ đồ phòng chiếu 3D trực quan, dễ dàng chọn ghế VIP, ghế thường hoặc ghế đôi (Couple).",
      icon: <Armchair size={28} weight="light" className="text-primary" />
    },
    {
      title: "Đặt Vé Nhanh Chóng",
      desc: "Quy trình đặt vé và thanh toán mô phỏng tối giản, hoàn tất giao dịch trong vòng 60 giây.",
      icon: <Sparkle size={28} weight="light" className="text-primary" />
    },
    {
      title: "Vé Điện Tử Tiện Lợi",
      desc: "Không cần in vé giấy. Nhận mã QR và mã vé trực tiếp qua hòm thư và lịch sử giao dịch.",
      icon: <Ticket size={28} weight="light" className="text-primary" />
    },
    {
      title: "Soát Vé Không Chạm",
      desc: "Nhân viên rạp quét mã QR check-in trực tiếp tại cửa phòng chiếu nhanh chóng và chuyên nghiệp.",
      icon: <ShieldCheck size={28} weight="light" className="text-primary" />
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Trải Nghiệm Đặt Vé Đột Phá</h2>
        <p className="text-xs text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
          CineGo mang lại giải pháp đặt vé thông minh, tối ưu trải nghiệm giải trí điện ảnh cho bạn và người thân
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((exp, i) => (
          <div key={i} className="p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-border">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card border border-border/80 p-6 space-y-4 shadow-soft h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border/40">
                {exp.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base leading-snug">{exp.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{exp.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
