"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Ticket } from "@phosphor-icons/react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Hồ sơ cá nhân", href: "/account/profile", icon: <User size={18} /> },
    { name: "Lịch sử đặt vé", href: "/account/bookings", icon: <Ticket size={18} /> },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Side: Account Navigation */}
        <aside className="md:col-span-1 space-y-2">
          <div className="p-4 bg-muted/40 border border-border/80 rounded-2xl space-y-1">
            <h2 className="text-xs font-bold text-muted-foreground uppercase px-3 py-1 tracking-wider">
              Tài Khoản
            </h2>
            <div className="space-y-1">
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
            </div>
          </div>
        </aside>

        {/* Right Side: Content Area */}
        <main className="md:col-span-3">
          <div className="p-1 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-border">
            <div className="rounded-[calc(2rem-0.5rem)] bg-card border border-border/80 p-6 md:p-8 shadow-soft dark:shadow-soft-dark min-h-[400px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
