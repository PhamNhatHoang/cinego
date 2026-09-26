"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { movieApi, showtimeApi } from "@/lib/api-services";
import type { Movie as ApiMovie, Showtime as ApiShowtime } from "@/lib/types";
import { Calendar, Clock, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";

interface MovieWithShowtimes {
  id: string;
  title: string;
  posterUrl: string;
  ageRating: string;
  genres: string;
  slots: { id: string; time: string }[];
}

export default function FeaturedShowtimes() {
  const router = useRouter();

  // Generate 3 dates from today
  const generateDates = () => {
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const result = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      result.push({
        value: d.toISOString().split("T")[0],
        label: weekdays[d.getDay()],
        day: String(d.getDate()).padStart(2, "0"),
        month: `Th ${d.getMonth() + 1}`,
      });
    }
    return result;
  };

  const datesList = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(datesList[0]?.value || "");
  const [moviesData, setMoviesData] = useState<MovieWithShowtimes[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    Promise.all([
      movieApi.getAll({ status: "NOW_SHOWING" }),
      showtimeApi.search({ date: selectedDate }),
    ])
      .then(([movies, showtimes]) => {
        // Group showtimes by movieId
        const showtimesByMovie: Record<number, ApiShowtime[]> = {};
        showtimes.forEach((s) => {
          if (!showtimesByMovie[s.movieId]) showtimesByMovie[s.movieId] = [];
          showtimesByMovie[s.movieId].push(s);
        });

        // Build data for movies that have showtimes
        const result: MovieWithShowtimes[] = movies
          .filter((m) => showtimesByMovie[m.id])
          .map((m) => ({
            id: String(m.id),
            title: m.title,
            posterUrl: m.posterUrl || "",
            ageRating: m.rated || "P",
            genres: (m.genres || []).join(", "),
            slots: (showtimesByMovie[m.id] || [])
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((s) => ({
                id: String(s.id),
                time: new Date(s.startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })),
          }));

        setMoviesData(result);
      })
      .catch(() => setMoviesData([]));
  }, [selectedDate]);

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
        {moviesData.length > 0 ? (
          moviesData.map((movie) => (
            <div 
              key={movie.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-border bg-card shadow-soft"
            >
              {/* Left Column: Movie Poster & Title */}
              <div className="md:col-span-4 flex gap-4 items-start">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg border border-border/40 shrink-0"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-muted text-muted-foreground border border-border/60 uppercase">
                    {movie.ageRating}
                  </span>
                  <h3 className="font-bold text-base hover:text-primary transition-colors line-clamp-2">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">{movie.genres}</p>
                </div>
              </div>

              {/* Right Column: Time Slots */}
              <div className="md:col-span-8 flex flex-wrap gap-3 items-center">
                {movie.slots.map((slot, index) => (
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
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Chưa có suất chiếu nào trong ngày này.
          </div>
        )}
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
