"use client";

import Link from "next/link";
import { Popcorn, Phone, Envelope, MapPin, FacebookLogo, InstagramLogo, YoutubeLogo, TwitterLogo } from "@phosphor-icons/react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-border/60 py-12 bg-card/15 text-xs">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-10">

        {/* Top Section: 4 Balanced Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <span className="text-white font-bold text-base tracking-tighter">C</span>
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                Cine<span className="text-primary">Go</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Hệ thống đặt vé xem phim trực tuyến hiện đại, mang lại trải nghiệm điện ảnh chân thực và sống động chuẩn quốc tế.
            </p>
            <div className="space-y-2 pt-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span className="font-mono font-bold text-foreground">1900 6006</span>
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Envelope size={14} className="text-primary" />
                <span>cskh@cinego.vn</span>
              </div>
            </div>
          </div>

          {/* Column 2: CineGo Links */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">CineGo</h4>
            <div className="flex flex-col gap-2.5 text-muted-foreground font-medium">
              <Link href="/movies?status=now-showing" className="hover:text-primary transition-colors">Phim đang chiếu</Link>
              <Link href="/movies?status=upcoming" className="hover:text-primary transition-colors">Phim sắp chiếu</Link>
              <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu rạp</Link>
              <Link href="/cinemas" className="hover:text-primary transition-colors">Danh sách rạp</Link>
            </div>
          </div>

          {/* Column 3: Support & Policies */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">Hỗ trợ & Chính sách</h4>
            <div className="flex flex-col gap-2.5 text-muted-foreground font-medium">
              <Link href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
              <Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
              <Link href="#" className="hover:text-primary transition-colors">Chính sách thanh toán</Link>
              <Link href="#" className="hover:text-primary transition-colors">Chăm sóc khách hàng</Link>
            </div>
          </div>

          {/* Column 4: Business Details */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">Thông tin doanh nghiệp</h4>
            <div className="space-y-2 text-muted-foreground text-[11px] leading-relaxed">
              <p className="font-bold text-foreground/95">CÔNG TY CỔ PHẦN GIẢI TRÍ CINEGO VIỆT NAM</p>
              <p>Mã số doanh nghiệp: 0102345678 do Sở KH&ĐT TP. Hồ Chí Minh cấp lần đầu ngày 16/07/2026</p>
              <div className="flex items-start gap-1.5 mt-1">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span>Tầng 5, Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Q. 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Social Media Icons */}
        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <Popcorn size={16} className="text-primary shrink-0" />
            <p>© 2026 CineGo Entertainment. All rights reserved.</p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Facebook">
                <FacebookLogo size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Instagram">
                <InstagramLogo size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Youtube">
                <YoutubeLogo size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Twitter">
                <TwitterLogo size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
