"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, Envelope, Lock, PencilSimple, Key, CheckCircle } from "@phosphor-icons/react";
import { Input, FormField, Button, ConfirmDialog, Tabs, Card, Badge } from "@/components/ui";

// Profile Info Schema
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Họ và tên phải chứa ít nhất 2 ký tự." })
    .max(50, { message: "Họ và tên không được vượt quá 50 ký tự." }),
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email." })
    .email({ message: "Địa chỉ email không hợp lệ." }),
  phone: z
    .string()
    .min(9, { message: "Số điện thoại phải chứa ít nhất 9 chữ số." })
    .max(12, { message: "Số điện thoại không hợp lệ." }),
});

// Password Change Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu hiện tại." }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu mới phải chứa ít nhất 8 ký tự." })
      .regex(/[A-Z]/, { message: "Phải chứa ít nhất 1 chữ hoa." })
      .regex(/[a-z]/, { message: "Phải chứa ít nhất 1 chữ thường." })
      .regex(/[0-9]/, { message: "Phải chứa ít nhất 1 chữ số." }),
    confirmNewPassword: z.string().min(1, { message: "Vui lòng xác nhận lại mật khẩu mới." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu mới xác nhận không khớp.",
    path: ["confirmNewPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const tabOptions = [
    { id: "info", label: "Thông tin cá nhân", icon: <User size={16} /> },
    { id: "password", label: "Đổi mật khẩu", icon: <Key size={16} /> },
  ];

  // 1. Profile Info Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Nhat Hoang",
      email: "customer@cinego.com",
      phone: "0901234567",
    },
  });

  // 2. Change Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onUpdateProfile = async (data: ProfileFormValues) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setSuccessMessage("Cập nhật thông tin cá nhân thành công!");
    setShowSuccessDialog(true);
  };

  const onChangePassword = async (data: PasswordFormValues) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    resetPasswordForm();
    setSuccessMessage("Đổi mật khẩu mới thành công!");
    setShowSuccessDialog(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary select-none">
          <User size={32} weight="duotone" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hồ Sơ Cá Nhân
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Loại thành viên:</span>
            <Badge variant="primary" className="text-[9px] px-1.5 py-0.5 rounded shadow-sm bg-gradient-to-r from-amber-500 to-yellow-500 border-none font-bold text-black uppercase">
              Thành viên vàng
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs list to toggle between Profile Edit and Password Change */}
      <Tabs
        options={tabOptions}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        className="w-full"
      />

      {/* Profile Form (Info Tab) */}
      {activeTab === "info" && (
        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Họ và tên" error={profileErrors.fullName?.message} required>
              <Input
                placeholder="Nguyễn Văn A"
                error={!!profileErrors.fullName}
                leftIcon={<User size={18} />}
                {...registerProfile("fullName")}
              />
            </FormField>

            <FormField label="Địa chỉ Email" error={profileErrors.email?.message} required>
              <Input
                type="email"
                placeholder="name@example.com"
                error={!!profileErrors.email}
                leftIcon={<Envelope size={18} />}
                {...registerProfile("email")}
              />
            </FormField>

            <FormField label="Số điện thoại" error={profileErrors.phone?.message} required>
              <Input
                placeholder="0901234567"
                error={!!profileErrors.phone}
                leftIcon={<Phone size={18} />}
                {...registerProfile("phone")}
              />
            </FormField>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<PencilSimple size={16} />}
              className="px-6 font-bold"
            >
              Cập nhật thông tin
            </Button>
          </div>
        </form>
      )}

      {/* Change Password Form (Password Tab) */}
      {activeTab === "password" && (
        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-6 max-w-md">
          <FormField
            label="Mật khẩu hiện tại"
            error={passwordErrors.currentPassword?.message}
            required
          >
            <Input
              type="password"
              placeholder="••••••••"
              error={!!passwordErrors.currentPassword}
              leftIcon={<Lock size={18} />}
              {...registerPassword("currentPassword")}
            />
          </FormField>

          <FormField
            label="Mật khẩu mới"
            error={passwordErrors.newPassword?.message}
            required
          >
            <Input
              type="password"
              placeholder="Tối thiểu 8 ký tự (hoa, thường, số)"
              error={!!passwordErrors.newPassword}
              leftIcon={<Lock size={18} />}
              {...registerPassword("newPassword")}
            />
          </FormField>

          <FormField
            label="Xác nhận mật khẩu mới"
            error={passwordErrors.confirmNewPassword?.message}
            required
          >
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              error={!!passwordErrors.confirmNewPassword}
              leftIcon={<Lock size={18} />}
              {...registerPassword("confirmNewPassword")}
            />
          </FormField>

          <div className="pt-4 border-t border-border/60">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              leftIcon={<Key size={16} />}
              className="px-6 font-bold"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      )}

      {/* Success Notification Dialog */}
      <ConfirmDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onConfirm={() => setShowSuccessDialog(false)}
        title="Thao tác thành công!"
        message={successMessage}
        confirmText="Xong"
        cancelText="Đóng"
      />
    </div>
  );
}
