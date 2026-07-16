"use client";

import React, { useState } from "react";
import { Tag, Plus, Pencil, Trash } from "@phosphor-icons/react";
import { DataTable, Button, Modal, FormField, Input, ConfirmDialog } from "@/components/ui";

interface Genre {
  id: string;
  name: string;
  code: string;
  count: number;
}

const INITIAL_GENRES: Genre[] = [
  { id: "g-1", name: "Hành động", code: "ACTION", count: 3 },
  { id: "g-2", name: "Phiêu lưu", code: "ADVENTURE", count: 2 },
  { id: "g-3", name: "Khoa học Viễn tưởng", code: "SCI-FI", count: 2 },
  { id: "g-4", name: "Hoạt hình", code: "ANIMATION", count: 2 },
  { id: "g-5", name: "Gia đình", code: "FAMILY", count: 2 },
  { id: "g-6", name: "Hài hước", code: "COMEDY", count: 2 },
];

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<Genre[]>(INITIAL_GENRES);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const handleOpenForm = (genre: Genre | null = null) => {
    if (genre) {
      setSelectedGenre(genre);
      setName(genre.name);
      setCode(genre.code);
    } else {
      setSelectedGenre(null);
      setName("");
      setCode("");
    }
    setIsFormOpen(true);
  };

  const handleSaveGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (selectedGenre) {
      setGenres((prev) =>
        prev.map((g) =>
          g.id === selectedGenre.id
            ? { ...g, name, code: code.toUpperCase().trim() }
            : g
        )
      );
    } else {
      const newGenre: Genre = {
        id: `g-${Math.floor(100 + Math.random() * 900)}`,
        name,
        code: code.toUpperCase().trim(),
        count: 0,
      };
      setGenres((prev) => [...prev, newGenre]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setGenreToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (genreToDelete) {
      setGenres((prev) => prev.filter((g) => g.id !== genreToDelete));
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Tên thể loại",
      accessorKey: "name" as keyof Genre,
      className: "font-bold text-foreground",
    },
    {
      header: "Mã Code",
      accessorKey: "code" as keyof Genre,
      className: "font-mono text-xs text-primary font-bold",
    },
    {
      header: "Số lượng phim",
      render: (row: Genre) => <span className="font-semibold">{row.count} phim</span>,
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: Genre) => (
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
            <Tag size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Thể Loại</h1>
            <p className="text-xs text-muted-foreground">Phân loại thể loại phim phục vụ cho công tác lọc và tìm kiếm</p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>
          Thêm Thể Loại
        </Button>
      </div>

      {/* Genres table */}
      <DataTable
        columns={columns}
        data={genres}
        searchKey="name"
        searchPlaceholder="Tìm kiếm tên thể loại..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedGenre ? "Cập Nhật Thể Loại" : "Thêm Thể Loại Mới"}
        size="sm"
      >
        <form onSubmit={handleSaveGenre} className="space-y-4 pt-2">
          <FormField label="Tên thể loại" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hành động, Hài hước..." required />
          </FormField>
          <FormField label="Mã Code" required>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ACTION, COMEDY..." required />
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
        title="Xác nhận xóa thể loại"
        message="Bạn có chắc muốn xóa thể loại phim này? Việc này có thể ảnh hưởng đến cách hiển thị tag của một số phim."
        confirmText="Xóa vĩnh viễn"
        isDanger
      />
    </div>
  );
}
