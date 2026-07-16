"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Popcorn, MagnifyingGlass } from "@phosphor-icons/react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="dark min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
      
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
      <footer className="border-t border-border/60 py-10 bg-card/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-3 max-w-[320px]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm tracking-tighter">C</span>
                </div>
                <span className="text-lg font-bold tracking-tighter uppercase font-sans">
                  Cine<span className="text-primary">Go</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hệ thống đặt vé xem phim trực tuyến hiện đại. Trải nghiệm xem phim tuyệt vời cùng rạp chiếu chuẩn quốc tế.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">CineGo</h4>
                <div className="flex flex-col gap-1.5 font-medium">
                  <Link href="/movies" className="hover:text-primary transition-colors">Phim đang chiếu</Link>
                  <Link href="/movies" className="hover:text-primary transition-colors">Phim sắp chiếu</Link>
                  <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu</Link>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Chính sách</h4>
                <div className="flex flex-col gap-1.5 font-medium">
                  <Link href="/" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
                  <Link href="/" className="hover:text-primary transition-colors">Chính sách thanh toán</Link>
                </div>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Liên hệ</h4>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Email: support@cinego.vn<br />
                  Hotline: 1900 1234<br />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
            <div className="flex items-center gap-2">
              <Popcorn size={16} className="text-primary" />
              <p>© 2026 CineGo Project. Đồ án kết thúc khóa học.</p>
            </div>
            <p className="font-mono">BUILD VERSION 1.1.0-ROUTEGROUPS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
