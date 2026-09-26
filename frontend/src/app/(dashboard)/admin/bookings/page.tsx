"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Trash, Eye, ShieldCheck, Clock } from "@phosphor-icons/react";
import { DataTable, Button, Badge, ConfirmDialog, Loading } from "@/components/ui";
import { bookingApi } from "@/lib/api-services";
import type { Booking } from "@/lib/types";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleOpenDelete = (id: number) => {
    setBookingToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete) {
      try {
        await bookingApi.cancel(bookingToDelete);
        await fetchBookings();
      } catch (err: any) {
        alert(`Lỗi: ${err.message}`);
      }
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Mã đơn vé",
      render: (row: Booking) => <span className="font-mono font-bold text-xs text-foreground uppercase select-all">{row.bookingCode}</span>,
    },
    {
      header: "Phim",
      accessorKey: "movieTitle" as keyof Booking,
      className: "font-extrabold text-foreground",
    },
    {
      header: "Lịch chiếu",
      render: (row: Booking) => (
        <span className="font-mono text-xs font-medium">
          {new Date(row.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(row.startTime).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Ghế",
      render: (row: Booking) => <span className="font-mono text-xs text-primary font-bold">{(row.seatNames || []).join(", ")}</span>,
    },
    {
      header: "Thành tiền",
      render: (row: Booking) => <span className="font-mono text-xs font-bold text-foreground">{Number(row.totalAmount).toLocaleString("vi-VN")} đ</span>,
    },
    {
      header: "Trạng thái",
      render: (row: Booking) => (
        <Badge variant={row.status === "PAID" ? "success" : row.status === "CANCELLED" ? "danger" : "secondary"}>
          {row.status === "PAID" ? "Thành công" : row.status === "CANCELLED" ? "Đã hủy" : "Đang chờ"}
        </Badge>
      ),
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: Booking) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="danger" size="xs" onClick={() => handleOpenDelete(row.id)} className="w-7 h-7 p-0 flex items-center justify-center rounded-lg">
            <Trash size={13} />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Ticket size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Đơn Vé</h1>
            <p className="text-xs text-muted-foreground">Theo dõi giao dịch, xử lý hủy/hoàn vé và doanh số bán hàng</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={bookings} searchKey="movieTitle" searchPlaceholder="Tìm kiếm tên phim..." />

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Xác nhận hủy giao dịch" message="Hành động này sẽ hủy giao dịch đặt vé này. Thao tác này không thể hoàn tác." confirmText="Hủy giao dịch" isDanger />
    </div>
  );
}
