"use client";

import React, { useState } from "react";
import { FilmReel, Plus, Pencil, Trash } from "@phosphor-icons/react";
import { MOCK_CINEMAS } from "@/mocks/home-mock-data";
import { DataTable, Button, Modal, FormField, Input, Select, ConfirmDialog } from "@/components/ui";

interface Auditorium {
  id: string;
  name: string;
  cinemaId: string;
  cinemaName: string;
  seatsCount: number;
  type: "STANDARD" | "IMAX" | "GOLD_CLASS";
}

const INITIAL_AUDITORIUMS: Auditorium[] = [
  { id: "a-1", name: "Phòng chiếu 1", cinemaId: "c-1", cinemaName: "CineGo Hùng Vương Plaza", seatsCount: 80, type: "STANDARD" },
  { id: "a-2", name: "Phòng chiếu 2 (IMAX)", cinemaId: "c-1", cinemaName: "CineGo Hùng Vương Plaza", seatsCount: 80, type: "IMAX" },
  { id: "a-3", name: "Phòng chiếu 1", cinemaId: "c-2", cinemaName: "CineGo Landmark 81", seatsCount: 80, type: "GOLD_CLASS" },
  { id: "a-4", name: "Phòng chiếu 2", cinemaId: "c-2", cinemaName: "CineGo Landmark 81", seatsCount: 80, type: "STANDARD" },
];

export default function AdminAuditoriumsPage() {
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>(INITIAL_AUDITORIUMS);
  const [selectedAud, setSelectedAud] = useState<Auditorium | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [audToDelete, setAudToDelete] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [cinemaId, setCinemaId] = useState("c-1");
  const [type, setType] = useState<"STANDARD" | "IMAX" | "GOLD_CLASS">("STANDARD");
  const [seatsCount, setSeatsCount] = useState(80);

  const handleOpenForm = (aud: Auditorium | null = null) => {
    if (aud) {
      setSelectedAud(aud);
      setName(aud.name);
      setCinemaId(aud.cinemaId);
      setType(aud.type);
      setSeatsCount(aud.seatsCount);
    } else {
      setSelectedAud(null);
      setName("");
      setCinemaId("c-1");
      setType("STANDARD");
      setSeatsCount(80);
    }
    setIsFormOpen(true);
  };

  const handleSaveAud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cinema = MOCK_CINEMAS.find((c) => c.id === cinemaId);
    const cinemaName = cinema ? cinema.name : "Rạp chưa xác định";

    if (selectedAud) {
      setAuditoriums((prev) =>
        prev.map((a) =>
          a.id === selectedAud.id
            ? { ...a, name, cinemaId, cinemaName, type, seatsCount: Number(seatsCount) }
            : a
        )
      );
    } else {
      const newAud: Auditorium = {
        id: `a-${Math.floor(100 + Math.random() * 900)}`,
        name,
        cinemaId,
        cinemaName,
        type,
        seatsCount: Number(seatsCount),
      };
      setAuditoriums((prev) => [...prev, newAud]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setAudToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (audToDelete) {
      setAuditoriums((prev) => prev.filter((a) => a.id !== audToDelete));
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Phòng chiếu",
      accessorKey: "name" as keyof Auditorium,
      className: "font-bold text-foreground",
    },
    {
      header: "Rạp chiếu",
      accessorKey: "cinemaName" as keyof Auditorium,
    },
    {
      header: "Loại phòng",
      render: (row: Auditorium) => (
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border ${
          row.type === "IMAX" 
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : row.type === "GOLD_CLASS"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-muted text-muted-foreground border-border"
        }`}>
          {row.type}
        </span>
      ),
    },
    {
      header: "Số lượng ghế",
      render: (row: Auditorium) => <span className="font-semibold">{row.seatsCount} ghế</span>,
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: Auditorium) => (
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
            <FilmReel size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Phòng Chiếu</h1>
            <p className="text-xs text-muted-foreground">Thiết lập phòng chiếu phim theo chi nhánh rạp CineGo</p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>
          Thêm Phòng Chiếu
        </Button>
      </div>

      {/* Auditoriums table */}
      <DataTable
        columns={columns}
        data={auditoriums}
        searchKey="name"
        searchPlaceholder="Tìm kiếm tên phòng..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedAud ? "Cập Nhật Phòng Chiếu" : "Thêm Phòng Chiếu Mới"}
        size="md"
      >
        <form onSubmit={handleSaveAud} className="space-y-4 pt-2">
          <FormField label="Tên phòng chiếu" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Phòng chiếu 3..." required />
          </FormField>
          <FormField label="Rạp chiếu tương ứng" required>
            <Select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}>
              {MOCK_CINEMAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Loại phòng chiếu" required>
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="STANDARD">Standard (Chuẩn)</option>
              <option value="IMAX">IMAX Cinema</option>
              <option value="GOLD_CLASS">Gold Class Luxury</option>
            </Select>
          </FormField>
          <FormField label="Số lượng ghế tối đa" required>
            <Input type="number" value={seatsCount} onChange={(e) => setSeatsCount(Number(e.target.value))} required />
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
        title="Xác nhận xóa phòng chiếu"
        message="Bạn có chắc muốn xóa phòng chiếu này? Các suất chiếu được xếp lịch tại phòng này cũng sẽ bị xóa bỏ."
        confirmText="Xóa vĩnh viễn"
        isDanger
      />
    </div>
  );
}
