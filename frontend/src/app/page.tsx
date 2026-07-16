"use client";

import { useTheme } from "@/components/ThemeProvider";
import { 
  Sun, 
  Moon, 
  FilmReel, 
  ArrowUpRight, 
  User, 
  ShieldCheck, 
  Ticket, 
  PresentationChart 
} from "@phosphor-icons/react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const routesList = [
    {
      title: "Xem danh sách phim",
      desc: "Trang hiển thị tất cả phim đang chiếu và sắp chiếu.",
      href: "/movies",
      icon: <FilmReel size={24} weight="light" className="text-primary" />,
      badge: "Customer",
    },
    {
      title: "Đặt vé & Chọn ghế",
      desc: "Sơ đồ phòng chiếu và quy trình đặt vé động theo suất chiếu.",
      href: "/booking/1",
      icon: <Ticket size={24} weight="light" className="text-primary" />,
      badge: "Customer",
    },
    {
      title: "Lịch sử đặt vé",
      desc: "Xem danh sách vé điện tử đã đặt của khách hàng.",
      href: "/account/bookings",
      icon: <User size={24} weight="light" className="text-primary" />,
      badge: "Customer",
    },
    {
      title: "Soát vé (Check-in)",
      desc: "Giao diện soát vé dành cho nhân viên rạp chiếu phim.",
      href: "/staff/check-in",
      icon: <ShieldCheck size={24} weight="light" className="text-primary" />,
      badge: "Staff",
    },
    {
      title: "Bảng quản trị Admin",
      desc: "Quản lý phim, rạp, suất chiếu, vé và báo cáo thống kê.",
      href: "/admin",
      icon: <PresentationChart size={24} weight="light" className="text-primary" />,
      badge: "Admin",
    },
  ];

  return (
    <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col justify-between">
      {/* Header Bar */}
      <header className="flex justify-between items-center w-full mb-16 md:mb-24 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl tracking-tighter">C</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter uppercase font-sans">
            Cine<span className="text-primary">Go</span>
          </span>
        </div>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-12 h-12 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-soft dark:shadow-soft-dark"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon size={20} weight="light" className="text-foreground" />
          ) : (
            <Sun size={20} weight="light" className="text-foreground" />
          )}
        </button>
      </header>

      {/* Main Hero & Navigation Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
      >
        {/* Left Side: Brand Statement */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-xs uppercase tracking-widest font-semibold text-primary">DỰ ÁN SƯỜN HỆ THỐNG</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[1.05] font-sans">
            Trải nghiệm <br />
            Đặt vé phim <br />
            <span className="text-primary">Đột phá.</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-[45ch] leading-relaxed">
            Dự án monorepo CineGo đã khởi tạo thành công phần sườn giao diện sáng và tối song song. Bạn có thể sử dụng các liên kết bên cạnh để duyệt qua các khung định tuyến đã thiết lập.
          </p>

          <div className="pt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-all duration-300 group active:scale-98"
            >
              <span>Kết nối GitHub</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <ArrowUpRight size={14} weight="bold" />
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right Side: Route Placeholders (Double-Bezel Layout) */}
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-7 p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-border"
        >
          {/* Inner Core */}
          <div className="rounded-[calc(2rem-0.5rem)] bg-card border border-border p-6 md:p-8 space-y-6 shadow-soft dark:shadow-soft-dark">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">Sơ đồ Định tuyến UI</h2>
              <span className="text-xs text-muted-foreground font-mono">5 ROUTES CONFIGURED</span>
            </div>

            <div className="divide-y divide-border/60">
              {routesList.map((route, index) => (
                <Link 
                  key={index} 
                  href={route.href}
                  className="flex items-center justify-between py-4 group hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border/40">
                      {route.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {route.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-muted text-muted-foreground border border-border/20">
                          {route.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{route.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:border-primary transition-all">
                    <ArrowUpRight size={14} className="text-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Details */}
      <footer className="mt-16 md:mt-24 border-t border-border/60 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
        <p>© 2026 CineGo Project. Đồ án kết thúc khóa học.</p>
        <div className="flex gap-6 font-mono">
          <span>BACKEND: localhost:8080</span>
          <span>FRONTEND: localhost:3000</span>
        </div>
      </footer>
    </main>
  );
}
