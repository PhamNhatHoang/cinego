"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_MOVIES, MOCK_SHOWTIMES } from "../data/home-mock-data";
import { Calendar, Clock, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

export default function FeaturedShowtimes() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("2026-07-16");

  const datesList = [
    { value: "2026-07-16", label: "T5", day: "16", month: "Th 7" },
    { value: "2026-07-17", label: "T6", day: "17", month: "Th 7" },
    { value: "2026-07-18", label: "T7", day: "18", month: "Th 7" },
  ];

  // Lọc các phim có lịch chiếu trong ngày được chọn
  const activeMovies = MOCK_MOVIES.filter(movie => {
    if (movie.status !== "NOW_SHOWING") return false;
    const hasShowtimes = MOCK_SHOWTIMES.some(s => s.movieId === movie.id && s.date === selectedDate);
    // Để trang chủ không bị trống dữ liệu mock, ta cho phép các phim có suất chiếu mẫu
    return movie.id === "m-1" || movie.id === "m-2" || movie.id === "m-3" || hasShowtimes;
  });

  const getShowtimesForMovie = (movieId: string) => {
    const showtimes = MOCK_SHOWTIMES.filter(s => s.movieId === movieId && s.date === selectedDate);
    if (showtimes.length === 0) {
      // Sinh suất chiếu mẫu nếu ngày đó chưa được định nghĩa
      return [
        { id: `s-f-1`, time: "11:30" },
        { id: `s-f-2`, time: "14:45" },
        { id: `s-f-3`, time: "17:15" },
        { id: `s-f-4`, time: "20:00" },
      ];
    }
    return showtimes;
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-border/60 pb-4 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Lịch Chiếu Nổi Bật</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn nhanh ngày và khung giờ suất chiếu để tiến hành giữ ghế đặt vé
          </p>
        </div>
        
        {/* Date Selector bar */}
        <div className="flex gap-2">
          {datesList.map((dateObj, i) => {
            const isActive = selectedDate === dateObj.value;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateObj.value)}
                className={`flex flex-col items-center p-2.5 min-w-[64px] rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "border-border bg-card hover:bg-muted text-foreground"
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">{dateObj.label}</span>
                <span className="text-lg font-black leading-none my-1">{dateObj.day}</span>
                <span className="text-[9px] font-medium opacity-90">{dateObj.month}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Movies Showtimes List */}
      <div className="space-y-6">
        {activeMovies.map((movie) => {
          const slots = getShowtimesForMovie(movie.id);
          return (
            <div 
              key={movie.id}
              className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border bg-card shadow-soft"
            >
              {/* Left Column: Movie Poster & Title */}
              <div className="flex gap-4 md:w-80 w-full shrink-0 items-start" style={{ minWidth: "320px" }}>
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg border border-border/40"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-muted text-muted-foreground border border-border/60 uppercase">
                    {movie.ageRating}
                  </span>
                  <h3 className="font-bold text-base hover:text-primary transition-colors line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">{movie.genre.join(", ")}</p>
                </div>
              </div>

              {/* Right Column: Time Slots */}
              <div className="flex-1 flex flex-wrap gap-3 items-center">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/booking/${slot.id}`)}
                    className="px-4 py-2.5 rounded-xl border border-border hover:border-primary/80 bg-background hover:bg-primary/5 hover:text-primary transition-all font-mono font-bold text-sm min-w-[76px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Clock size={14} />
                    <span>{slot.time}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="flex justify-center pt-4">
        <Link 
          href="/showtimes" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted text-sm font-semibold transition-all group"
        >
          <span>Xem toàn bộ lịch chiếu</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
