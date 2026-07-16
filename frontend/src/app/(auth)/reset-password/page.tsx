"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, FormField, Button, ConfirmDialog } from "@/components/ui";
import { Lock, Warning } from "@phosphor-icons/react";

// Define validation schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Mật khẩu mới phải chứa ít nhất 8 ký tự." })
      .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa." })
      .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường." })
      .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ số." }),
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận lại mật khẩu." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    setShowSuccessDialog(true);
  };

  const handleSuccessConfirm = () => {
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Đặt lại mật khẩu
        </h2>
        <p className="text-xs text-muted-foreground">
          Nhập mật khẩu mới bảo mật cao cho tài khoản của bạn
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 flex items-start gap-2">
          <Warning size={16} className="shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Password Field */}
        <FormField label="Mật khẩu mới" error={errors.password?.message} required>
          <Input
            type="password"
            placeholder="Tối thiểu 8 ký tự (hoa, thường, số)"
            error={!!errors.password}
            leftIcon={<Lock size={18} />}
            {...register("password")}
          />
        </FormField>

        {/* Confirm Password Field */}
        <FormField
          label="Xác nhận mật khẩu mới"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            error={!!errors.confirmPassword}
            leftIcon={<Lock size={18} />}
            {...register("confirmPassword")}
          />
        </FormField>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 font-bold"
          isLoading={isLoading}
        >
          Lưu mật khẩu mới
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        <Link
          href="/login"
          className="text-primary hover:underline font-bold transition-all"
        >
          Quay lại Đăng nhập
        </Link>
      </div>

      {/* Success Modal */}
      <ConfirmDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={handleSuccessConfirm}
        title="Đặt lại thành công!"
        message="Mật khẩu mới của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới để đăng nhập."
        confirmText="Đăng nhập ngay"
        cancelText="Đóng"
      />
    </div>
  );
}
