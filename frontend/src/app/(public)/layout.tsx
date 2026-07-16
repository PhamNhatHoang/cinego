"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Popcorn } from "@phosphor-icons/react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Client Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg tracking-tighter">C</span>
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                Cine<span className="text-primary">Go</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <Link href="/movies" className="hover:text-primary transition-colors">Danh sách Phim</Link>
              <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="text-xs font-semibold px-4 py-2 rounded-full border border-border bg-card hover:bg-muted transition-all"
            >
              Đăng nhập
            </Link>

            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={18} weight="light" className="text-foreground" />
              ) : (
                <Sun size={18} weight="light" className="text-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Client Footer */}
      <footer className="border-t border-border/60 py-8 bg-card/30">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <div className="flex items-center gap-2">
            <Popcorn size={16} className="text-primary" />
            <p>© 2026 CineGo Project. Đồ án kết thúc khóa học.</p>
          </div>
          <div className="flex gap-6 font-mono">
            <Link href="/movies" className="hover:underline">Movies</Link>
            <Link href="/showtimes" className="hover:underline">Showtimes</Link>
            <Link href="/admin" className="hover:underline">Admin Panel</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
