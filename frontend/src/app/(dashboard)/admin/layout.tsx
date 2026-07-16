"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Sun, 
  Moon, 
  PresentationChart,
  FilmSlate,
  Compass,
  FilmReel,
  Calendar,
  Ticket,
  Users,
  SignOut,
  House,
  Tag,
  Armchair
} from "@phosphor-icons/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: "Tổng quan Dashboard", href: "/admin", icon: <PresentationChart size={18} /> },
    { name: "Quản lý Phim", href: "/admin/movies", icon: <FilmSlate size={18} /> },
    { name: "Quản lý Thể loại", href: "/admin/genres", icon: <Tag size={18} /> },
    { name: "Quản lý Rạp chiếu", href: "/admin/cinemas", icon: <Compass size={18} /> },
    { name: "Quản lý Phòng chiếu", href: "/admin/auditoriums", icon: <FilmReel size={18} /> },
    { name: "Thiết lập Sơ đồ ghế", href: "/admin/seats", icon: <Armchair size={18} /> },
    { name: "Quản lý Suất chiếu", href: "/admin/showtimes", icon: <Calendar size={18} /> },
    { name: "Quản lý Đơn vé", href: "/admin/bookings", icon: <Ticket size={18} /> },
    { name: "Quản lý Người dùng", href: "/admin/users", icon: <Users size={18} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-tighter">C</span>
            </div>
            <span className="text-lg font-bold tracking-tighter uppercase font-sans">
              Cine<span className="text-primary">Go</span> <span className="text-[10px] lowercase text-muted-foreground">admin</span>
            </span>
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-1 pt-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <House size={18} />
            <span>Về trang chủ</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <SignOut size={18} />
            <span>Đăng xuất</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card px-8 flex justify-between items-center sticky top-0 z-30">
          <div className="text-xs text-muted-foreground font-mono">
            Hệ thống Quản trị v1.0
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>
            <div className="text-sm font-semibold px-4 py-2 rounded-full border border-border bg-card">
              Administrator
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
