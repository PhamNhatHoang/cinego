"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Popcorn, MagnifyingGlass, Phone, Envelope, MapPin, FacebookLogo, InstagramLogo, YoutubeLogo, TwitterLogo } from "@phosphor-icons/react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
      
      {/* Client Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex justify-between items-center gap-4">
          
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg tracking-tighter">C</span>
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                Cine<span className="text-primary">Go</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <Link href="/movies" className="hover:text-primary transition-colors">Phim đang chiếu</Link>
              <Link href="/movies" className="hover:text-primary transition-colors">Phim sắp chiếu</Link>
              <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu</Link>
            </nav>
          </div>

          {/* Right: Search, Auth & Theme Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Search Input Mockup */}
            <div className="relative hidden md:block w-48 xl:w-64">
              <input
                type="text"
                placeholder="Tìm phim..."
                className="w-full bg-muted/40 border border-border hover:border-primary/30 focus:border-primary px-3 py-1.5 pl-9 rounded-full text-xs outline-none transition-colors"
              />
              <MagnifyingGlass size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Link 
              href="/login"
              className="text-xs font-bold px-4 py-2 rounded-full border border-border bg-card hover:bg-muted transition-all cursor-pointer shrink-0"
            >
              Đăng nhập
            </Link>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={16} weight="light" className="text-foreground" />
              ) : (
                <Sun size={16} weight="light" className="text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Client Footer */}
      <footer className="border-t border-border/60 py-12 bg-card/20 text-xs relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-10">
          
          {/* Top Section: Branding, Links and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Column 1: Brand Info & Business Details (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                  <span className="text-white font-bold text-base tracking-tighter">C</span>
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                  Cine<span className="text-primary">Go</span>
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed text-xs max-w-[400px]">
                CineGo là hệ thống đặt vé xem phim trực tuyến hiện đại bậc nhất. Chúng tôi mang đến trải nghiệm điện ảnh chuẩn quốc tế với công nghệ chiếu IMAX và Dolby Atmos tiên tiến.
              </p>
              
              {/* Business Registration Details */}
              <div className="space-y-1.5 pt-2 text-[11px] text-muted-foreground/80 border-t border-border/40 max-w-[400px]">
                <p className="font-bold text-foreground/90 uppercase text-[10px] tracking-wider mb-1">CÔNG TY CỔ PHẦN GIẢI TRÍ CINEGO VIỆT NAM</p>
                <p>Số ĐKKD: 0102345678 do Sở KH&ĐT TP. Hồ Chí Minh cấp ngày 16/07/2026</p>
                <div className="flex items-start gap-1.5 mt-1">
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span>Văn phòng: Tầng 5, Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Quận 1, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>

            {/* Column 2: Navigation Links (4 cols) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">CineGo</h4>
                <div className="flex flex-col gap-2 text-muted-foreground font-medium">
                  <Link href="/movies" className="hover:text-primary transition-colors">Phim đang chiếu</Link>
                  <Link href="/movies" className="hover:text-primary transition-colors">Phim sắp chiếu</Link>
                  <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu rạp</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Khuyến mãi & Tin tức</Link>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">Chính sách & Hỗ trợ</h4>
                <div className="flex flex-col gap-2 text-muted-foreground font-medium">
                  <Link href="/" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Chính sách thanh toán</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Chăm sóc khách hàng</Link>
                </div>
              </div>
            </div>

            {/* Column 3: Contacts, Social & Badges (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-foreground text-[10px]">Liên hệ hỗ trợ</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    <span className="font-mono font-bold text-foreground">1900 6006</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Envelope size={14} className="text-primary" />
                    <span className="font-medium">cskh@cinego.vn</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[9px]">Kết nối với chúng tôi</h4>
                <div className="flex items-center gap-2.5">
                  <a href="#" className="w-8 h-8 rounded-full border border-border bg-card hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Facebook">
                    <FacebookLogo size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-border bg-card hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Instagram">
                    <InstagramLogo size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-border bg-card hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Youtube">
                    <YoutubeLogo size={16} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full border border-border bg-card hover:bg-primary hover:text-white flex items-center justify-center transition-all cursor-pointer" aria-label="Twitter">
                    <TwitterLogo size={16} />
                  </a>
                </div>
              </div>

              {/* Ministry of Industry and Trade Mock Badge */}
              <div className="pt-1">
                <a href="#" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-[9px] font-bold uppercase tracking-wider">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  Đã đăng ký Bộ Công Thương
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Section: Copyright & Payment Partners */}
          <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-muted-foreground gap-4">
            <div className="flex items-center gap-2">
              <Popcorn size={16} className="text-primary shrink-0" />
              <p>© 2026 CineGo Entertainment. Toàn bộ bản quyền được bảo lưu.</p>
            </div>
            
            {/* Payment Partners Badges */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 select-none">
              <span className="text-[9px]">ĐỐI TÁC THANH TOÁN:</span>
              <span className="px-2 py-0.5 border border-border rounded bg-card font-mono">VISA</span>
              <span className="px-2 py-0.5 border border-border rounded bg-card font-mono">MC</span>
              <span className="px-2 py-0.5 border border-border rounded bg-card font-mono">MOMO</span>
              <span className="px-2 py-0.5 border border-border rounded bg-card font-mono">VNPAY</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
