"use client";

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Quên mật khẩu</h2>
        <p className="text-xs text-muted-foreground">Nhập email để nhận mã khôi phục mật khẩu</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground" htmlFor="email">Email tài khoản</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:border-primary text-sm transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Gửi yêu cầu
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline font-semibold">
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}
