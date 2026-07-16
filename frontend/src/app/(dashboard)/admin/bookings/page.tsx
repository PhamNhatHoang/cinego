"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Trash, Eye, ShieldCheck, Clock } from "@phosphor-icons/react";
import { DataTable, Button, Badge, ConfirmDialog } from "@/components/ui";

interface BookingRecord {
  id: string;
  showtimeId: string;
  movieTitle: string;
  showtimeTime: string;
  showtimeDate: string;
  cinemaName: string;
  seats: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const fetchBookings = () => {
    const saved = localStorage.getItem("cinego_bookings");
    let list: BookingRecord[] = saved ? JSON.parse(saved) : [];

    // Fallback seed dummy data if empty
    if (list.length === 0) {
      list = [
        {
          id: "CG-9840212",
          showtimeId: "s-103",
          movieTitle: "Captain America: Brave New World",
          showtimeTime: "19:00",
          showtimeDate: "2026-07-16",
          cinemaName: "CineGo Hùng Vương Plaza",
          seats: "G9, G10",
          totalPrice: 220000,
          paymentMethod: "Ví điện tử MoMo",
          paymentStatus: "SUCCESS",
          createdAt: "16/07/2026, 23:25:00",
        },
        {
          id: "CG-8120445",
          showtimeId: "s-203",
          movieTitle: "Mufasa: The Lion King",
          showtimeTime: "14:30",
          showtimeDate: "2026-07-16",
          cinemaName: "CineGo Landmark 81",
          seats: "F5, F6",
          totalPrice: 220000,
          paymentMethod: "Thẻ tín dụng",
          paymentStatus: "SUCCESS",
          createdAt: "15/07/2026, 14:00:15",
        },
      ];
      localStorage.setItem("cinego_bookings", JSON.stringify(list));
    }
    setBookings(list);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenDelete = (id: string) => {
    setBookingToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bookingToDelete) {
      const updated = bookings.filter((b) => b.id !== bookingToDelete);
      localStorage.setItem("cinego_bookings", JSON.stringify(updated));
      setBookings(updated);
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Mã đơn vé",
      accessorKey: "id" as keyof BookingRecord,
      className: "font-mono font-bold text-xs text-foreground uppercase select-all",
    },
    {
      header: "Phim",
      accessorKey: "movieTitle" as keyof BookingRecord,
      className: "font-extrabold text-foreground",
    },
    {
      header: "Lịch chiếu",
      render: (row: BookingRecord) => (
        <span className="font-mono text-xs font-medium">
          {row.showtimeTime} - {row.showtimeDate}
        </span>
      ),
    },
    {
      header: "Ghế",
      accessorKey: "seats" as keyof BookingRecord,
      className: "font-mono text-xs text-primary font-bold",
    },
    {
      header: "Thành tiền",
      render: (row: BookingRecord) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {row.totalPrice.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      header: "Trạng thái",
      render: (row: BookingRecord) => (
        <Badge variant={row.paymentStatus === "SUCCESS" ? "success" : "secondary"}>
          {row.paymentStatus === "SUCCESS" ? "Thành công" : "Đã hủy"}
        </Badge>
      ),
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: BookingRecord) => (
        <div className="flex items-center justify-end gap-2">
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
            <Ticket size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Đơn Vé</h1>
            <p className="text-xs text-muted-foreground">Theo dõi giao dịch, xử lý hủy/hoàn vé và doanh số bán hàng</p>
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <DataTable
        columns={columns}
        data={bookings}
        searchKey="movieTitle"
        searchPlaceholder="Tìm kiếm tên phim..."
      />

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận hủy giao dịch"
        message="Hành động này sẽ xóa vĩnh viễn hóa đơn đặt vé xem phim khỏi cơ sở dữ liệu hệ thống. Thao tác này không thể hoàn tác."
        confirmText="Hủy giao dịch"
        isDanger
      />
    </div>
  );
}
