"use client";

import React, { useState, useEffect } from "react";
import { FilmReel, Plus, Pencil, Trash } from "@phosphor-icons/react";
import { auditoriumApi, cinemaApi } from "@/lib/api-services";
import type { Auditorium as ApiAuditorium, Cinema as ApiCinema } from "@/lib/types";
import { DataTable, Button, Modal, FormField, Input, Select, ConfirmDialog, Loading } from "@/components/ui";

interface AuditoriumRow {
  id: number;
  name: string;
  cinemaId: number;
  cinemaName: string;
  seatsCount: number;
  type: string;
}

export default function AdminAuditoriumsPage() {
  const [auditoriums, setAuditoriums] = useState<AuditoriumRow[]>([]);
  const [cinemas, setCinemas] = useState<ApiCinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAud, setSelectedAud] = useState<AuditoriumRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [audToDelete, setAudToDelete] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [type, setType] = useState<"STANDARD" | "IMAX" | "GOLD_CLASS">("STANDARD");
  const [seatsCount, setSeatsCount] = useState(80);

  const fetchData = async () => {
    try {
      const [audData, cinData] = await Promise.all([auditoriumApi.getAll(), cinemaApi.getAll()]);
      setCinemas(cinData);
      setAuditoriums(audData.map((a) => ({
        id: a.id,
        name: a.name,
        cinemaId: a.cinemaId,
        cinemaName: a.cinemaName || cinData.find((c) => c.id === a.cinemaId)?.name || "N/A",
        seatsCount: a.seatsCount || a.totalSeats || 0,
        type: a.type || "STANDARD",
      })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenForm = (aud: AuditoriumRow | null = null) => {
    if (aud) {
      setSelectedAud(aud);
      setName(aud.name);
      setCinemaId(String(aud.cinemaId));
      setType(aud.type as any);
      setSeatsCount(aud.seatsCount);
    } else {
      setSelectedAud(null);
      setName("");
      setCinemaId(cinemas[0]?.id ? String(cinemas[0].id) : "");
      setType("STANDARD");
      setSeatsCount(80);
    }
    setIsFormOpen(true);
  };

  const handleSaveAud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const payload = { name, cinemaId: Number(cinemaId), type, seatsCount: Number(seatsCount) };
      if (selectedAud) {
        await auditoriumApi.update(selectedAud.id, payload);
      } else {
        await auditoriumApi.create(payload);
      }
      await fetchData();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setAudToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (audToDelete) {
      try {
        await auditoriumApi.delete(audToDelete);
        setAuditoriums((prev) => prev.filter((a) => a.id !== audToDelete));
      } catch (err: any) {
        alert(`Lỗi xóa: ${err.message}`);
      }
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    { header: "Phòng chiếu", accessorKey: "name" as keyof AuditoriumRow, className: "font-bold text-foreground" },
    { header: "Rạp chiếu", accessorKey: "cinemaName" as keyof AuditoriumRow },
    {
      header: "Loại phòng",
      render: (row: AuditoriumRow) => (
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
          row.type === "IMAX" ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
          : row.type === "GOLD_CLASS" ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
          : "bg-muted text-muted-foreground border-border"
        }`}>{row.type}</span>
      ),
    },
    { header: "Số lượng ghế", render: (row: AuditoriumRow) => <span className="font-semibold">{row.seatsCount} ghế</span> },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: AuditoriumRow) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="xs" onClick={() => handleOpenForm(row)} className="w-7 h-7 p-0 flex items-center justify-center rounded-lg"><Pencil size={13} /></Button>
          <Button variant="danger" size="xs" onClick={() => handleOpenDelete(row.id)} className="w-7 h-7 p-0 flex items-center justify-center rounded-lg"><Trash size={13} /></Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loading size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/60 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0"><FilmReel size={24} weight="duotone" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Phòng Chiếu</h1>
            <p className="text-xs text-muted-foreground">Thiết lập phòng chiếu phim theo chi nhánh rạp CineGo</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>Thêm Phòng Chiếu</Button>
      </div>

      <DataTable columns={columns} data={auditoriums} searchKey="name" searchPlaceholder="Tìm kiếm tên phòng..." />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedAud ? "Cập Nhật Phòng Chiếu" : "Thêm Phòng Chiếu Mới"} size="md">
        <form onSubmit={handleSaveAud} className="space-y-4 pt-2">
          <FormField label="Tên phòng chiếu" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Phòng chiếu 3..." required /></FormField>
          <FormField label="Rạp chiếu tương ứng" required>
            <Select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}>
              {cinemas.map((c) => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
            </Select>
          </FormField>
          <FormField label="Loại phòng chiếu" required>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="STANDARD">Standard (Chuẩn)</option>
              <option value="IMAX">IMAX Cinema</option>
              <option value="GOLD_CLASS">Gold Class Luxury</option>
            </Select>
          </FormField>
          <FormField label="Số lượng ghế tối đa" required><Input type="number" value={seatsCount} onChange={(e) => setSeatsCount(Number(e.target.value))} required /></FormField>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="primary" size="sm">Lưu Lại</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Xác nhận xóa phòng chiếu" message="Bạn có chắc muốn xóa phòng chiếu này?" confirmText="Xóa vĩnh viễn" isDanger />
    </div>
  );
}
