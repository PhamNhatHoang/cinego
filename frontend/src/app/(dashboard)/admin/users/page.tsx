"use client";

import React, { useState } from "react";
import { Users, Plus, Pencil, Trash, IdentificationCard } from "@phosphor-icons/react";
import { DataTable, Button, Modal, FormField, Input, Select, ConfirmDialog } from "@/components/ui";

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
}

const INITIAL_USERS: UserRecord[] = [
  { id: "u-1", fullName: "Administrator", email: "admin@cinego.com", phone: "0901112223", role: "ADMIN" },
  { id: "u-2", fullName: "Nguyễn Văn A (Staff)", email: "staff@cinego.com", phone: "0904445556", role: "STAFF" },
  { id: "u-3", fullName: "Pham Nhat Hoang", email: "customer@cinego.com", phone: "0901234567", role: "CUSTOMER" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF" | "CUSTOMER">("CUSTOMER");

  const handleOpenForm = (user: UserRecord | null = null) => {
    if (user) {
      setSelectedUser(user);
      setFullName(user.fullName);
      setEmail(user.email);
      setPhone(user.phone);
      setRole(user.role);
    } else {
      setSelectedUser(null);
      setFullName("");
      setEmail("");
      setPhone("");
      setRole("CUSTOMER");
    }
    setIsFormOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, fullName, email, phone, role } : u
        )
      );
    } else {
      const newUser: UserRecord = {
        id: `u-${Math.floor(100 + Math.random() * 900)}`,
        fullName,
        email,
        phone,
        role,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setUserToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Họ và tên",
      accessorKey: "fullName" as keyof UserRecord,
      className: "font-bold text-foreground",
    },
    {
      header: "Email liên hệ",
      accessorKey: "email" as keyof UserRecord,
    },
    {
      header: "Số điện thoại",
      accessorKey: "phone" as keyof UserRecord,
      className: "font-mono text-xs",
    },
    {
      header: "Vai trò",
      render: (row: UserRecord) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
          row.role === "ADMIN"
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : row.role === "STAFF"
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : "bg-green-500/10 text-green-500 border-green-500/20"
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: UserRecord) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleOpenForm(row)}
            className="w-7 h-7 p-0 flex items-center justify-center rounded-lg"
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => handleOpenDelete(row.id)}
            className="w-7 h-7 p-0 flex items-center justify-center rounded-lg"
          >
            <Trash size={13} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex items-center justify-between border-b border-border/60 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Users size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Người Dùng</h1>
            <p className="text-xs text-muted-foreground">Phân quyền tài khoản quản trị viên, nhân viên soát vé và khách hàng</p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>
          Thêm Người Dùng
        </Button>
      </div>

      {/* Users table */}
      <DataTable
        columns={columns}
        data={users}
        searchKey="fullName"
        searchPlaceholder="Tìm kiếm tên người dùng..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedUser ? "Cập Nhật Người Dùng" : "Thêm Người Dùng Mới"}
        size="md"
      >
        <form onSubmit={handleSaveUser} className="space-y-4 pt-2">
          <FormField label="Họ và tên" required>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn B..." required />
          </FormField>
          <FormField label="Địa chỉ Email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </FormField>
          <FormField label="Số điện thoại" required>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567..." required />
          </FormField>
          <FormField label="Vai trò hệ thống" required>
            <Select value={role} onChange={(e) => setRole(e.target.value as any)}>
              <option value="CUSTOMER">CUSTOMER (Khách hàng)</option>
              <option value="STAFF">STAFF (Nhân viên soát vé)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </Select>
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Lưu Lại
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa tài khoản"
        message="Hành động này sẽ gỡ bỏ quyền truy cập của tài khoản người dùng khỏi hệ thống CineGo."
        confirmText="Xóa vĩnh viễn"
        isDanger
      />
    </div>
  );
}
