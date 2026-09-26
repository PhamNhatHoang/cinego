"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Pencil, Trash, Clock } from "@phosphor-icons/react";
import { showtimeApi, movieApi, cinemaApi } from "@/lib/api-services";
import type { Showtime as ApiShowtime, Movie as ApiMovie, Cinema as ApiCinema } from "@/lib/types";
import { 
  DataTable, 
  Button, 
  Modal, 
  FormField, 
  Input, 
  Select, 
  ConfirmDialog,
  Loading 
} from "@/components/ui";

interface ShowtimeRow {
  id: number;
  movieId: number;
  cinemaId: number;
  movieTitle: string;
  cinemaName: string;
  date: string;
  time: string;
  startTime: string;
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ShowtimeRow[]>([]);
  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [cinemas, setCinemas] = useState<ApiCinema[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<number | null>(null);

  // Form Fields
  const [movieId, setMovieId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");

  // Fetch data
  useEffect(() => {
    Promise.all([
      showtimeApi.search({}),
      movieApi.getAll(),
      cinemaApi.getAll(),
    ])
      .then(([stData, mvData, cnData]) => {
        setMovies(mvData);
        setCinemas(cnData);
        setShowtimes(stData.map((s) => ({
          id: s.id,
          movieId: s.movieId,
          cinemaId: s.cinemaId,
          movieTitle: s.movieTitle,
          cinemaName: s.cinemaName,
          date: new Date(s.startTime).toLocaleDateString("vi-VN"),
          time: new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          startTime: s.startTime,
        })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleOpenForm = (showtime: ShowtimeRow | null = null) => {
    if (showtime) {
      setSelectedShowtime(showtime);
      setMovieId(String(showtime.movieId));
      setCinemaId(String(showtime.cinemaId));
      const dt = new Date(showtime.startTime);
      setDate(dt.toISOString().split("T")[0]);
      setTime(dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    } else {
      setSelectedShowtime(null);
      setMovieId(movies[0]?.id ? String(movies[0].id) : "");
      setCinemaId(cinemas[0]?.id ? String(cinemas[0].id) : "");
      setDate(new Date().toISOString().split("T")[0]);
      setTime("19:00");
    }
    setIsFormOpen(true);
  };

  const handleSaveShowtime = async (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = `${date}T${time}:00`;

    try {
      if (selectedShowtime) {
        await showtimeApi.update(selectedShowtime.id, {
          movieId: Number(movieId),
          cinemaId: Number(cinemaId),
          startTime,
        });
      } else {
        await showtimeApi.create({
          movieId: Number(movieId),
          cinemaId: Number(cinemaId),
          startTime,
        });
      }
      // Refresh
      const updated = await showtimeApi.search({});
      setShowtimes(updated.map((s) => ({
        id: s.id,
        movieId: s.movieId,
        cinemaId: s.cinemaId,
        movieTitle: s.movieTitle,
        cinemaName: s.cinemaName,
        date: new Date(s.startTime).toLocaleDateString("vi-VN"),
        time: new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        startTime: s.startTime,
      })));
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setShowtimeToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (showtimeToDelete) {
      try {
        await showtimeApi.delete(showtimeToDelete);
        setShowtimes((prev) => prev.filter((s) => s.id !== showtimeToDelete));
      } catch (err: any) {
        alert(`Lỗi xóa: ${err.message}`);
      }
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Suất chiếu",
      render: (row: ShowtimeRow) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary shrink-0" />
          <span className="font-mono font-bold text-foreground text-sm">{row.time}</span>
        </div>
      ),
    },
    {
      header: "Ngày chiếu",
      accessorKey: "date" as keyof ShowtimeRow,
      className: "font-mono text-xs",
    },
    {
      header: "Tên phim",
      accessorKey: "movieTitle" as keyof ShowtimeRow,
      className: "font-bold text-foreground",
    },
    {
      header: "Rạp chiếu",
      accessorKey: "cinemaName" as keyof ShowtimeRow,
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: ShowtimeRow) => (
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

      <DataTable columns={columns} data={showtimes} searchKey="movieTitle" searchPlaceholder="Tìm kiếm theo tên phim..." />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedShowtime ? "Cập Nhật Lịch Chiếu" : "Xếp Lịch Chiếu Mới"} size="md">
        <form onSubmit={handleSaveShowtime} className="space-y-4 pt-2">
          <FormField label="Phim chiếu" required>
            <Select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
              {movies.map((m) => (
                <option key={m.id} value={String(m.id)}>{m.title}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Chi nhánh rạp" required>
            <Select value={cinemaId} onChange={(e) => setCinemaId(e.target.value)}>
              {cinemas.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
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
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="primary" size="sm">Lưu Lại</Button>
          </div>
        </form>
      </Modal>

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
