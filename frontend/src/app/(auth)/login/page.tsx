"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, FormField, Button } from "@/components/ui";
import { Envelope, Lock, Warning, Info } from "@phosphor-icons/react";

// Define validation schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email." })
    .email({ message: "Địa chỉ email không hợp lệ." }),
  password: z
    .string()
    .min(6, { message: "Mật khẩu phải chứa ít nhất 6 ký tự." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const email = data.email.toLowerCase().trim();
    const password = data.password;

    // Direct routing based on credentials for demonstration
    if (password === "password123") {
      if (email === "customer@cinego.com" || email === "hoang@cinego.com") {
        router.push("/");
      } else if (email === "staff@cinego.com") {
        router.push("/staff");
      } else if (email === "admin@cinego.com") {
        router.push("/admin");
      } else {
        setErrorMsg("Tài khoản demo chưa chính xác. Vui lòng xem gợi ý bên dưới.");
        setIsLoading(false);
      }
    } else {
      setErrorMsg("Mật khẩu không chính xác. Thử lại với: password123");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Chào mừng trở lại
        </h2>
        <p className="text-xs text-muted-foreground">
          Đăng nhập tài khoản CineGo của bạn để tiếp tục đặt vé
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-2">
          <Warning size={16} className="shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField label="Email" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="name@example.com"
            error={!!errors.email}
            leftIcon={<Envelope size={18} />}
            {...register("email")}
          />
        </FormField>

        {/* Password Field */}
        <FormField
          label="Mật khẩu"
          error={errors.password?.message}
          required
        >
          <div className="space-y-1">
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                error={!!errors.password}
                leftIcon={<Lock size={18} />}
                {...register("password")}
              />
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-bold transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </FormField>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 font-bold"
          isLoading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>

      {/* Demo Credentials Helper Box */}
      <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-1.5 text-foreground font-bold border-b border-border/40 pb-1.5">
          <Info size={14} className="text-primary" />
          <span>Tài khoản Demo (Password: password123)</span>
        </div>
        <div className="space-y-1 font-medium font-mono text-[10px]">
          <p>
            • Khách hàng: <span className="text-foreground font-bold">customer@cinego.com</span>
          </p>
          <p>
            • Nhân viên: <span className="text-foreground font-bold">staff@cinego.com</span>
          </p>
          <p>
            • Quản trị: <span className="text-foreground font-bold">admin@cinego.com</span>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        <span>Chưa có tài khoản? </span>
        <Link
          href="/register"
          className="text-primary hover:underline font-bold transition-all"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
