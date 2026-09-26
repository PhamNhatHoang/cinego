"use client";

import React, { useState, useEffect } from "react";
import { Compass, Plus, Pencil, Trash, MapPin } from "@phosphor-icons/react";
import { cinemaApi } from "@/lib/api-services";
import type { Cinema as ApiCinema } from "@/lib/types";
import { DataTable, Button, Modal, FormField, Input, ConfirmDialog, Loading } from "@/components/ui";

interface CinemaRow {
  id: number;
  name: string;
  address: string;
}

export default function AdminCinemasPage() {
  const [cinemas, setCinemas] = useState<CinemaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCinema, setSelectedCinema] = useState<CinemaRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [cinemaToDelete, setCinemaToDelete] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const fetchCinemas = async () => {
    try {
      const data = await cinemaApi.getAll();
      setCinemas(data.map((c) => ({ id: c.id, name: c.name, address: c.address })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCinemas(); }, []);

  const handleOpenForm = (cinema: CinemaRow | null = null) => {
    if (cinema) {
      setSelectedCinema(cinema);
      setName(cinema.name);
      setAddress(cinema.address);
    } else {
      setSelectedCinema(null);
      setName("");
      setAddress("");
    }
    setIsFormOpen(true);
  };

  const handleSaveCinema = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    try {
      if (selectedCinema) {
        await cinemaApi.update(selectedCinema.id, { name, address });
      } else {
        await cinemaApi.create({ name, address });
      }
      await fetchCinemas();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setCinemaToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (cinemaToDelete) {
      try {
        await cinemaApi.delete(cinemaToDelete);
        setCinemas((prev) => prev.filter((c) => c.id !== cinemaToDelete));
      } catch (err: any) {
        alert(`Lỗi xóa: ${err.message}`);
      }
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Tên rạp chiếu",
      accessorKey: "name" as keyof CinemaRow,
      className: "font-bold text-foreground",
    },
    {
      header: "Địa chỉ liên hệ",
      render: (row: CinemaRow) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={14} className="text-primary shrink-0" />
          <span>{row.address}</span>
        </div>
      ),
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: CinemaRow) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="xs" onClick={() => handleOpenForm(row)} className="w-7 h-7 p-0 flex items-center justify-center rounded-lg">
            <Pencil size={13} />
          </Button>
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
            <Compass size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Rạp Chiếu</h1>
            <p className="text-xs text-muted-foreground">Quản lý mạng lưới chi nhánh và địa điểm rạp CineGo toàn quốc</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>Thêm Rạp Mới</Button>
      </div>

      <DataTable columns={columns} data={cinemas} searchKey="name" searchPlaceholder="Tìm kiếm tên rạp..." />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedCinema ? "Cập Nhật Thông Tin Rạp" : "Thêm Rạp Chiếu Mới"} size="md">
        <form onSubmit={handleSaveCinema} className="space-y-4 pt-2">
          <FormField label="Tên rạp chiếu" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="CineGo Landmark 81..." required /></FormField>
          <FormField label="Địa chỉ" required><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số..., Quận..., TP..." required /></FormField>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="primary" size="sm">Lưu Lại</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Xác nhận xóa rạp" message="Bạn có chắc muốn xóa rạp này? Toàn bộ phòng chiếu và suất chiếu tại rạp này cũng sẽ bị hủy." confirmText="Xóa vĩnh viễn" isDanger />
    </div>
  );
}
