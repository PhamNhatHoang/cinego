"use client";

import Link from "next/link";
import { ArrowRight, FilmReel } from "@phosphor-icons/react";

export default function HomeCallToAction() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-8 md:py-16 w-full">
      {/* Outer Shell */}
      <div className="p-1 rounded-[2rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent border border-primary/20">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.5rem)] bg-card border border-border p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          {/* Subtle design element */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FilmReel size={24} weight="light" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight max-w-[20ch] mx-auto leading-tight">
            Sẵn Sàng Cho Trải Nghiệm Điện Ảnh Tuyệt Vời?
          </h2>

          <p className="text-muted-foreground text-xs md:text-sm max-w-[45ch] mx-auto leading-relaxed">
            Xem lịch chiếu mới nhất, chọn ghế VIP rạp IMAX và tiến hành đặt vé trực tuyến nhanh chóng cùng CineGo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Khám phá phim</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/showtimes"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-xs font-semibold transition-all"
            >
              <span>Xem lịch chiếu</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
