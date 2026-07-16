"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Movie, Cinema, Showtime } from "../types/home.types";
import { MOCK_MOVIES, MOCK_CINEMAS, MOCK_SHOWTIMES } from "@/mocks/home-mock-data";
import { MagnifyingGlass, Calendar, Compass, FilmSlate, Ticket } from "@phosphor-icons/react";

export default function QuickBooking() {
  const router = useRouter();
  
  // States
  const [movies] = useState<Movie[]>(MOCK_MOVIES.filter(m => m.status === "NOW_SHOWING"));
  const [cinemas] = useState<Cinema[]>(MOCK_CINEMAS);
  const [dates, setDates] = useState<string[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  // Selected values
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedCinema, setSelectedCinema] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedShowtime, setSelectedShowtime] = useState<string>("");

  // Tạo danh sách 3 ngày từ ngày hôm nay (giả lập 16/07/2026)
  useEffect(() => {
    setDates(["2026-07-16", "2026-07-17", "2026-07-18"]);
  }, []);

  // Lọc suất chiếu khi thay đổi Phim, Rạp, Ngày
  useEffect(() => {
    if (selectedMovie && selectedCinema && selectedDate) {
      // Trong mock data, ta chỉ cấu hình showtime cho một số ngày hôm nay
      // Để tránh trống rỗng, ta sẽ lọc hoặc tự sinh suất chiếu ngẫu nhiên
      const filtered = MOCK_SHOWTIMES.filter(
        s => s.movieId === selectedMovie && 
             s.cinemaId === selectedCinema && 
             s.date === selectedDate
      );
      
      // Nếu không có trong mock data, ta tự sinh vài suất chiếu mẫu để người dùng dễ thử nghiệm
      if (filtered.length === 0) {
        setShowtimes([
          { id: `s-gen-1`, movieId: selectedMovie, cinemaId: selectedCinema, date: selectedDate, time: "12:00" },
          { id: `s-gen-2`, movieId: selectedMovie, cinemaId: selectedCinema, date: selectedDate, time: "15:30" },
          { id: `s-gen-3`, movieId: selectedMovie, cinemaId: selectedCinema, date: selectedDate, time: "18:45" },
          { id: `s-gen-4`, movieId: selectedMovie, cinemaId: selectedCinema, date: selectedDate, time: "21:15" },
        ]);
      } else {
        setShowtimes(filtered);
      }
    } else {
      setShowtimes([]);
    }
    setSelectedShowtime(""); // Reset suất chiếu khi thay đổi bộ lọc khác
  }, [selectedMovie, selectedCinema, selectedDate]);

  const handleBook = () => {
    if (selectedShowtime) {
      router.push(`/booking/${selectedShowtime}`);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    if (dateStr === "2026-07-16") return "Hôm nay (16/07)";
    if (dateStr === "2026-07-17") return "Ngày mai (17/07)";
    if (dateStr === "2026-07-18") return "Ngày kia (18/07)";
    return dateStr;
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
