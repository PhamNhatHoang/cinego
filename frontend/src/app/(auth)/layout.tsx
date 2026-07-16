"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "@phosphor-icons/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-6 bg-background">
      {/* Top Bar */}
      <header className="flex justify-between items-center w-full max-w-[1200px] mx-auto h-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-border bg-card hover:bg-muted transition-all">
          <ArrowLeft size={14} />
          <span>Về trang chủ</span>
        </Link>

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
      </header>

      {/* Auth Content Container */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-[420px] p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-border">
          <div className="rounded-[calc(2rem-0.5rem)] bg-card border border-border/80 p-8 shadow-soft dark:shadow-soft-dark space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg tracking-tighter">C</span>
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase font-sans">
                  Cine<span className="text-primary">Go</span>
                </span>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground">
        <p>© 2026 CineGo. Hệ thống đặt vé an toàn.</p>
      </footer>
    </div>
  );
}
