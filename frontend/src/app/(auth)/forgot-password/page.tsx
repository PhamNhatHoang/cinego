"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, FormField, Button, ConfirmDialog } from "@/components/ui";
import { Envelope, Warning } from "@phosphor-icons/react";

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email." })
    .email({ message: "Địa chỉ email không hợp lệ." }),
});

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock logic - email not registered check
    if (data.email.toLowerCase().trim() === "unknown@cinego.com") {
      setErrorMsg("Email này chưa được đăng ký trong hệ thống.");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setShowSuccessDialog(true);
    }
  };

  const handleSuccessConfirm = () => {
    router.push("/reset-password");
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Quên mật khẩu
        </h2>
        <p className="text-xs text-muted-foreground">
          Nhập địa chỉ email tài khoản của bạn để nhận hướng dẫn khôi phục
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
        <FormField label="Email tài khoản" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="name@example.com"
            error={!!errors.email}
            leftIcon={<Envelope size={18} />}
            {...register("email")}
          />
        </FormField>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 font-bold"
          isLoading={isLoading}
        >
          Gửi yêu cầu
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
        title="Yêu cầu thành công!"
        message="Hệ thống đã nhận yêu cầu cấp lại mật khẩu. Trong môi trường demo, hãy bấm nút dưới đây để chuyển hướng thẳng tới trang đặt lại mật khẩu mới."
        confirmText="Đặt lại mật khẩu"
        cancelText="Đóng"
      />
    </div>
  );
}
