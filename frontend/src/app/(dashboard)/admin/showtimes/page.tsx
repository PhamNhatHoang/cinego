"use client";

import React, { useState } from "react";
import { Calendar, Plus, Pencil, Trash, Clock } from "@phosphor-icons/react";
import { MOCK_SHOWTIMES, MOCK_MOVIES, MOCK_CINEMAS } from "@/mocks/home-mock-data";
import { Showtime } from "@/features/home/types/home.types";
import { 
  DataTable, 
  Button, 
  Modal, 
  FormField, 
  Input, 
  Select, 
  ConfirmDialog 
} from "@/components/ui";

interface ShowtimeRecord extends Showtime {
  movieTitle: string;
  cinemaName: string;
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ShowtimeRecord[]>(() => {
    return MOCK_SHOWTIMES.map((s) => {
      const movie = MOCK_MOVIES.find((m) => m.id === s.movieId);
      const cinema = MOCK_CINEMAS.find((c) => c.id === s.cinemaId);
      return {
        ...s,
        movieTitle: movie ? movie.title : "Phim chưa xác định",
        cinemaName: cinema ? cinema.name : "Rạp chưa xác định",
      };
    });
  });

  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<string | null>(null);

  // Form Fields State
  const [movieId, setMovieId] = useState("m-1");
  const [cinemaId, setCinemaId] = useState("c-1");
  const [date, setDate] = useState("2026-07-16");
  const [time, setTime] = useState("19:00");

  const handleOpenForm = (showtime: ShowtimeRecord | null = null) => {
    if (showtime) {
      setSelectedShowtime(showtime);
      setMovieId(showtime.movieId);
      setCinemaId(showtime.cinemaId);
      setDate(showtime.date);
      setTime(showtime.time);
    } else {
      setSelectedShowtime(null);
      setMovieId("m-1");
      setCinemaId("c-1");
      setDate("2026-07-16");
      setTime("19:00");
    }
    setIsFormOpen(true);
  };

  const handleSaveShowtime = (e: React.FormEvent) => {
    e.preventDefault();

    const movie = MOCK_MOVIES.find((m) => m.id === movieId);
    const cinema = MOCK_CINEMAS.find((c) => c.id === cinemaId);

    const movieTitle = movie ? movie.title : "Phim chưa xác định";
    const cinemaName = cinema ? cinema.name : "Rạp chưa xác định";

    if (selectedShowtime) {
      setShowtimes((prev) =>
        prev.map((s) =>
          s.id === selectedShowtime.id
            ? { ...s, movieId, cinemaId, movieTitle, cinemaName, date, time }
            : s
        )
      );
    } else {
      const newShowtime: ShowtimeRecord = {
        id: `s-${Math.floor(100 + Math.random() * 900)}`,
        movieId,
        cinemaId,
        movieTitle,
        cinemaName,
        date,
        time,
      };
      setShowtimes((prev) => [newShowtime, ...prev]);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setShowtimeToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (showtimeToDelete) {
      setShowtimes((prev) => prev.filter((s) => s.id !== showtimeToDelete));
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Suất chiếu",
      render: (row: ShowtimeRecord) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary shrink-0" />
          <span className="font-mono font-bold text-foreground text-sm">{row.time}</span>
        </div>
      ),
    },
    {
      header: "Ngày chiếu",
      accessorKey: "date" as keyof ShowtimeRecord,
      className: "font-mono text-xs",
    },
    {
      header: "Tên phim",
      accessorKey: "movieTitle" as keyof ShowtimeRecord,
      className: "font-bold text-foreground",
    },
    {
      header: "Rạp chiếu",
      accessorKey: "cinemaName" as keyof ShowtimeRecord,
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: ShowtimeRecord) => (
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
            <Calendar size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Suất Chiếu</h1>
            <p className="text-xs text-muted-foreground">Xếp lịch chiếu phim theo khung giờ chiếu và phòng máy chiếu rạp</p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>
          Thêm Suất Chiếu
        </Button>
      </div>

      {/* Showtimes Table */}
      <DataTable
        columns={columns}
        data={showtimes}
        searchKey="movieTitle"
        searchPlaceholder="Tìm kiếm theo tên phim..."
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedShowtime ? "Cập Nhật Lịch Chiếu" : "Xếp Lịch Chiếu Mới"}
        size="md"
      >
        <form onSubmit={handleSaveShowtime} className="space-y-4 pt-2">
          <FormField label="Phim chiếu" required>
            <Select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
              {MOCK_MOVIES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Chi nhánh rạp" required>
            <Select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}>
              {MOCK_CINEMAS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Ngày chiếu" required>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </FormField>
          <FormField label="Giờ chiếu" required>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
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
        title="Xác nhận xóa suất chiếu"
        message="Bạn có chắc chắn muốn xóa suất chiếu này? Các giao dịch đang chọn ghế liên quan sẽ bị hủy bỏ."
        confirmText="Xóa vĩnh viễn"
        isDanger
      />
    </div>
  );
}
