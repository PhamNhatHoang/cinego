"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, MagnifyingGlass } from "@phosphor-icons/react";

export default function PublicHeader() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/movies");
    }
  };

  return (
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
            <Link href="/movies?status=now-showing" className="hover:text-primary transition-colors">Phim đang chiếu</Link>
            <Link href="/movies?status=upcoming" className="hover:text-primary transition-colors">Phim sắp chiếu</Link>
            <Link href="/showtimes" className="hover:text-primary transition-colors">Lịch chiếu</Link>
            <Link href="/cinemas" className="hover:text-primary transition-colors">Rạp chiếu</Link>
          </nav>
        </div>

        {/* Right: Search, Auth & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 xl:w-64">
            <input
              type="text"
              placeholder="Tìm phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 border border-border hover:border-primary/30 focus:border-primary px-3 py-1.5 pl-9 rounded-full text-xs outline-none transition-colors"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
              <MagnifyingGlass size={14} />
            </button>
          </form>

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
  );
}
