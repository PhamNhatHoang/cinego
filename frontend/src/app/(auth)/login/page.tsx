"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Chào mừng trở lại</h2>
        <p className="text-xs text-muted-foreground">Đăng nhập tài khoản CineGo của bạn</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm transition-colors"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-muted-foreground" htmlFor="password">Mật khẩu</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
              Quên mật khẩu?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Đăng nhập
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        <span>Chưa có tài khoản? </span>
        <Link href="/register" className="text-primary hover:underline font-semibold">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
