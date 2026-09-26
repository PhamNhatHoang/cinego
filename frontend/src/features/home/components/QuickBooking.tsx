"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Movie, Cinema } from "../types/home.types";
import { movieApi, cinemaApi, showtimeApi } from "@/lib/api-services";
import type { Showtime as ApiShowtime } from "@/lib/types";
import { MagnifyingGlass, Calendar, Compass, FilmSlate, Ticket } from "@phosphor-icons/react";

export default function QuickBooking() {
  const router = useRouter();
  
  // States
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [showtimes, setShowtimes] = useState<{ id: string; time: string }[]>([]);

  // Selected values
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");

  // Fetch movies and cinemas from API
  useEffect(() => {
    movieApi.getAll({ status: "NOW_SHOWING" }).then((data) => {
      setMovies(data.map((m) => ({
        id: String(m.id),
        title: m.title,
        description: m.description || "",
        posterUrl: m.posterUrl || "",
        backdropUrl: m.trailerUrl || m.posterUrl || "",
        genre: m.genres || [],
        duration: m.duration,
        releaseDate: m.releaseDate || "",
        ageRating: m.rated || "P",
        status: "NOW_SHOWING" as const,
      })));
    }).catch(() => setMovies([]));

    cinemaApi.getAll().then((data) => {
      setCinemas(data.map((c) => ({
        id: String(c.id),
        name: c.name,
        address: c.address,
      })));
    }).catch(() => setCinemas([]));
  }, []);

  // Generate 7 days from today
  useEffect(() => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    setDates(days);
  }, []);

  // Fetch showtimes when movie, cinema, date are all selected
  useEffect(() => {
    if (selectedMovie && selectedCinema && selectedDate) {
      showtimeApi
        .search({
          movieId: Number(selectedMovie),
          cinemaId: Number(selectedCinema),
          date: selectedDate,
        })
        .then((data) => {
          setShowtimes(
            data.map((s) => ({
              id: String(s.id),
              time: new Date(s.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        })
        .catch(() => setShowtimes([]));
    } else {
      setShowtimes([]);
    }
    setSelectedShowtime("");
  }, [selectedMovie, selectedCinema, selectedDate]);

  const handleBook = () => {
    if (selectedShowtime) {
      router.push(`/booking/${selectedShowtime}`);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr + "T00:00:00");
    const diff = Math.round((d.getTime() - new Date(today.toISOString().split("T")[0] + "T00:00:00").getTime()) / 86400000);
    const dayMonth = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    if (diff === 0) return `Hôm nay (${dayMonth})`;
    if (diff === 1) return `Ngày mai (${dayMonth})`;
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return `${weekdays[d.getDay()]} (${dayMonth})`;
  };

  return (
    <div id="quick-booking-bar" className="w-full max-w-[1200px] mx-auto px-6 -mt-10 relative z-30">
      <div className="p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-border/80 shadow-2xl backdrop-blur-md">

        <div className="rounded-[calc(1.5rem-0.25rem)] bg-card/90 border border-border/60 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          {/* 1. Chọn Phim */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
              <FilmSlate size={14} className="text-primary" />
              <span>1. Chọn Phim</span>
            </label>
            <select
              value={selectedMovie}
              onChange={(e) => {
                setSelectedMovie(e.target.value);
                setSelectedCinema("");
                setSelectedDate("");
              }}
              className="w-full bg-background border border-border hover:border-primary/50 text-foreground px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
            >
              <option value="">-- Chọn phim đang chiếu --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>

          {/* 2. Chọn Rạp */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
              <Compass size={14} className="text-primary" />
              <span>2. Chọn Rạp</span>
            </label>
            <select
              value={selectedCinema}
              onChange={(e) => {
                setSelectedCinema(e.target.value);
                setSelectedDate("");
              }}
              disabled={!selectedMovie}
              className="w-full bg-background border border-border hover:border-primary/50 text-foreground px-3 py-2.5 rounded-xl text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Chọn rạp chiếu --</option>
              {cinemas.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* 3. Chọn Ngày */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              <span>3. Chọn Ngày</span>
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={!selectedCinema}
              className="w-full bg-background border border-border hover:border-primary/50 text-foreground px-3 py-2.5 rounded-xl text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Chọn ngày chiếu --</option>
              {dates.map((d) => (
                <option key={d} value={d}>{formatDateLabel(d)}</option>
              ))}
            </select>
          </div>

          {/* 4. Chọn Suất Chiếu */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
              <Ticket size={14} className="text-primary" />
              <span>4. Suất Chiếu</span>
            </label>
            <select
              value={selectedShowtime}
              onChange={(e) => setSelectedShowtime(e.target.value)}
              disabled={!selectedDate}
              className="w-full bg-background border border-border hover:border-primary/50 text-foreground px-3 py-2.5 rounded-xl text-sm outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              <option value="">-- Giờ chiếu --</option>
              {showtimes.map((s) => (
                <option key={s.id} value={s.id}>{s.time}</option>
              ))}
            </select>
          </div>

          {/* Button Submit */}
          <div>
            <button
              onClick={handleBook}
              disabled={!selectedShowtime}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <MagnifyingGlass size={16} weight="bold" />
              <span>Tìm suất chiếu</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
