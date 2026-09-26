"use client";

import React, { useState, useEffect } from "react";
import { FilmSlate, Plus, Pencil, Trash, Star, Clock } from "@phosphor-icons/react";
import { movieApi } from "@/lib/api-services";
import type { Movie as ApiMovie } from "@/lib/types";
import { 
  DataTable, 
  Button, 
  Card, 
  Badge, 
  Modal, 
  FormField, 
  Input, 
  Select, 
  ConfirmDialog,
  Loading 
} from "@/components/ui";

interface MovieRow {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  duration: number;
  ageRating: string;
  status: string;
  releaseDate: string;
  genres: string[];
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<MovieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<MovieRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<number | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [duration, setDuration] = useState(120);
  const [ageRating, setAgeRating] = useState("T13");
  const [status, setStatus] = useState<"NOW_SHOWING" | "UPCOMING">("NOW_SHOWING");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");

  const fetchMovies = async () => {
    try {
      const data = await movieApi.getAll();
      setMovies(data.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description || "",
        posterUrl: m.posterUrl || "",
        duration: m.duration,
        ageRating: m.rated || "P",
        status: m.status || "NOW_SHOWING",
        releaseDate: m.releaseDate || "",
        genres: m.genres || [],
      })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleOpenForm = (movie: MovieRow | null = null) => {
    if (movie) {
      setSelectedMovie(movie);
      setTitle(movie.title);
      setDescription(movie.description);
      setPosterUrl(movie.posterUrl);
      setDuration(movie.duration);
      setAgeRating(movie.ageRating);
      setStatus(movie.status as any);
      setReleaseDate(movie.releaseDate);
      setGenre(movie.genres.join(", "));
    } else {
      setSelectedMovie(null);
      setTitle("");
      setDescription("");
      setPosterUrl("");
      setDuration(120);
      setAgeRating("T13");
      setStatus("NOW_SHOWING");
      setReleaseDate(new Date().toISOString().split("T")[0]);
      setGenre("Hành động, Phiêu lưu");
    }
    setIsFormOpen(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const genresList = genre.split(",").map((g) => g.trim()).filter((g) => g !== "");

    try {
      const payload = {
        title,
        description,
        posterUrl,
        duration: Number(duration),
        rated: ageRating,
        status,
        releaseDate,
        genres: genresList,
      };

      if (selectedMovie) {
        await movieApi.update(selectedMovie.id, payload);
      } else {
        await movieApi.create(payload);
      }
      await fetchMovies();
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    }
    setIsFormOpen(false);
  };

  const handleOpenDelete = (id: number) => {
    setMovieToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (movieToDelete) {
      try {
        await movieApi.delete(movieToDelete);
        setMovies((prev) => prev.filter((m) => m.id !== movieToDelete));
      } catch (err: any) {
        alert(`Lỗi xóa: ${err.message}`);
      }
    }
    setIsDeleteOpen(false);
  };

  const columns = [
    {
      header: "Phim",
      render: (row: MovieRow) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-14 rounded overflow-hidden border shrink-0 bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.posterUrl} alt="" className="object-cover w-full h-full" />
          </div>
          <div className="space-y-1">
            <div className="font-extrabold text-foreground line-clamp-1">{row.title}</div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              <span>{row.duration} phút • {row.genres.slice(0, 2).join(", ")}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Độ tuổi",
      render: (row: MovieRow) => <Badge variant="age-rating" ratingType={row.ageRating} />,
    },
    {
      header: "Trạng thái",
      render: (row: MovieRow) => (
        <Badge variant={row.status === "NOW_SHOWING" ? "success" : "secondary"}>
          {row.status === "NOW_SHOWING" ? "Đang chiếu" : "Sắp chiếu"}
        </Badge>
      ),
    },
    {
      header: "Khởi chiếu",
      accessorKey: "releaseDate" as keyof MovieRow,
      className: "font-mono text-xs",
    },
    {
      header: "Hành động",
      className: "text-right shrink-0",
      render: (row: MovieRow) => (
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
            <FilmSlate size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Quản Lý Phim</h1>
            <p className="text-xs text-muted-foreground">Thêm mới, sửa đổi thông tin và phân loại các phim chiếu rạp</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => handleOpenForm(null)} leftIcon={<Plus size={16} />}>Thêm Phim Mới</Button>
      </div>

      <DataTable columns={columns} data={movies} searchKey="title" searchPlaceholder="Tìm kiếm tên phim..." emptyTitle="Không có phim" emptyDescription="Chưa có phim nào được khởi tạo trong hệ thống." />

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={selectedMovie ? "Cập Nhật Thông Tin Phim" : "Thêm Phim Mới"} size="lg">
        <form onSubmit={handleSaveMovie} className="space-y-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Tên phim" required><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên phim chiếu rạp..." required /></FormField>
            <FormField label="Thời lượng (Phút)" required><Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required /></FormField>
            <FormField label="Độ tuổi" required>
              <Select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
                <option value="P">P - Mọi lứa tuổi</option>
                <option value="T13">T13 - Trên 13 tuổi</option>
                <option value="T16">T16 - Trên 16 tuổi</option>
                <option value="T18">T18 - Trên 18 tuổi</option>
              </Select>
            </FormField>
            <FormField label="Trạng thái chiếu" required>
              <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="NOW_SHOWING">Đang chiếu (Now Showing)</option>
                <option value="UPCOMING">Sắp chiếu (Upcoming)</option>
              </Select>
            </FormField>
            <FormField label="Ngày khởi chiếu" required><Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required /></FormField>
            <FormField label="Thể loại (cách nhau bởi dấu phẩy)" required><Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Hành động, Hoạt hình..." required /></FormField>
          </div>
          <FormField label="Đường dẫn ảnh bìa (Poster URL)"><Input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} /></FormField>
          <FormField label="Tóm tắt phim" required><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả tóm tắt nội dung..." required /></FormField>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <Button variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" variant="primary" size="sm">Lưu Lại</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} title="Xác nhận xóa phim" message="Bạn có chắc chắn muốn gỡ bỏ bộ phim này khỏi hệ thống?" confirmText="Xóa vĩnh viễn" isDanger />
    </div>
  );
}
