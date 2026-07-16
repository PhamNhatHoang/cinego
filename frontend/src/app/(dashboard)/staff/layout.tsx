"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { 
  Sun, 
  Moon, 
  Scan,
  House,
  SignOut,
  IdentificationCard,
  List,
  X
} from "@phosphor-icons/react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Tổng quan Staff", href: "/staff", icon: <IdentificationCard size={18} /> },
    { name: "Soát vé (Check-in)", href: "/staff/check-in", icon: <Scan size={18} /> },
  ];

  const handleCloseSidebar = () => setIsMobileOpen(false);

  return (
    <div className="flex min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={handleCloseSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Staff Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col justify-between p-4 h-screen shrink-0 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Close for Mobile */}
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg tracking-tighter">C</span>
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase font-sans">
                Cine<span className="text-primary">Go</span> <span className="text-[10px] lowercase text-muted-foreground">staff</span>
              </span>
            </div>
            <button
              onClick={handleCloseSidebar}
              className="lg:hidden w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={handleCloseSidebar}
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
      <div className="flex-1 flex flex-col bg-muted/20 min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card px-6 md:px-8 flex justify-between items-center sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center cursor-pointer text-foreground transition-all hover:bg-muted"
              aria-label="Open sidebar"
            >
              <List size={18} />
            </button>
            <div className="text-xs text-muted-foreground font-mono truncate max-w-[150px] sm:max-w-none">
              Khu vực nghiệp vụ kiểm vé
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <Moon size={16} />
              ) : (
                <Sun size={16} />
              )}
            </button>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border bg-card shrink-0 select-none">
              Staff: Nguyễn Văn A
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

