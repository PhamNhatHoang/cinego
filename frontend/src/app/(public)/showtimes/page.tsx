"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MOCK_MOVIES, MOCK_CINEMAS, MOCK_SHOWTIMES } from "@/mocks/home-mock-data";
import { Badge, Button, Card, EmptyState, Loading, Select } from "@/components/ui";
import { Clock, Calendar, Ticket, MapPin, Funnel } from "@phosphor-icons/react";

function ShowtimesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query params or set default values
  const dateParam = searchParams.get("date") || "2026-07-16";
  const cinemaParam = searchParams.get("cinemaId") || "Tất cả";

  // Date selection options
  const dateOptions = [
    { value: "2026-07-16", label: "T5", dateNum: "16", month: "Th 7" },
    { value: "2026-07-17", label: "T6", dateNum: "17", month: "Th 7" },
    { value: "2026-07-18", label: "T7", dateNum: "18", month: "Th 7" },
  ];

  // Update query parameters in URL
  const updateParams = (updates: { date?: string; cinemaId?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.date !== undefined) {
      params.set("date", updates.date);
    }
    if (updates.cinemaId !== undefined) {
      if (updates.cinemaId !== "Tất cả") {
        params.set("cinemaId", updates.cinemaId);
      } else {
        params.delete("cinemaId");
      }
    }
    router.push(`/showtimes?${params.toString()}`);
  };

  // Filter and group showtimes by Movie
  const moviesWithShowtimes = useMemo(() => {
    // 1. Filter showtimes matching current date & cinemaId
    const filteredShowtimes = MOCK_SHOWTIMES.filter((s) => {
      const matchDate = s.date === dateParam;
      const matchCinema = cinemaParam === "Tất cả" || s.cinemaId === cinemaParam;
      return matchDate && matchCinema;
    });

    // 2. Group by MovieId
    const movieGroups: { [movieId: string]: typeof filteredShowtimes } = {};
    filteredShowtimes.forEach((s) => {
      if (!movieGroups[s.movieId]) {
        movieGroups[s.movieId] = [];
      }
      movieGroups[s.movieId].push(s);
    });

    // 3. Map to full movie and cinema info list
    return Object.keys(movieGroups).map((movieId) => {
      const movie = MOCK_MOVIES.find((m) => m.id === movieId);
      
      // Group slots by Cinema inside this movie
      const cinemaGroups: { [cinemaId: string]: typeof filteredShowtimes } = {};
      movieGroups[movieId].forEach((s) => {
        if (!cinemaGroups[s.cinemaId]) {
          cinemaGroups[s.cinemaId] = [];
        }
        cinemaGroups[s.cinemaId].push(s);
      });

      const cinemasData = Object.keys(cinemaGroups).map((cinemaId) => {
        const cinema = MOCK_CINEMAS.find((c) => c.id === cinemaId);
        return {
          cinema,
          slots: cinemaGroups[cinemaId].sort((a, b) => a.time.localeCompare(b.time)),
        };
      });

      return {
        movie,
        cinemas: cinemasData,
      };
    }).filter(item => item.movie !== undefined);
  }, [dateParam, cinemaParam]);

  const handleDateChange = (dateVal: string) => {
    updateParams({ date: dateVal });
  };

  const handleCinemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ cinemaId: e.target.value });
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-24 space-y-8 min-h-[calc(100vh-16rem)]">
      {/* Title Header */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Lịch Chiếu Phim
        </h1>
        <p className="text-xs text-muted-foreground">
          Chọn ngày chiếu và rạp CineGo mong muốn để xem lịch chiếu chi tiết.
        </p>
      </div>

      {/* Date & Cinema filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-4.5 rounded-2xl shadow-soft">
        
        {/* Date Selector */}
        <div className="space-y-2 shrink-0">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Calendar size={12} className="text-primary" />
            <span>Chọn Ngày chiếu</span>
          </label>
          <div className="flex items-center gap-2.5">
            {dateOptions.map((d) => {
              const isSelected = dateParam === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => handleDateChange(d.value)}
                  className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border transition-all duration-300 min-w-[65px] select-none ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/15 scale-102"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase opacity-85">{d.label}</span>
                  <span className="text-base font-extrabold font-mono mt-0.5">{d.dateNum}</span>
                  <span className="text-[8px] opacity-75">{d.month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cinema Selector */}
        <div className="space-y-2 w-full md:w-64">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <MapPin size={12} className="text-primary" />
            <span>Chọn Rạp chiếu</span>
          </label>
          <Select
            value={cinemaParam}
            onChange={handleCinemaChange}
            className="rounded-xl font-medium"
          >
            <option value="Tất cả">Tất cả rạp CineGo</option>
            {MOCK_CINEMAS.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </option>
            ))}
          </Select>
        </div>

      </div>

      {/* Showtimes List */}
      <div className="space-y-6">
        {moviesWithShowtimes.length > 0 ? (
          moviesWithShowtimes.map(({ movie, cinemas }) => {
            if (!movie) return null;
            return (
              <Card
                key={movie.id}
                variant="double-bezel"
                className="p-0 border-none"
                innerClassName="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Left: Movie poster & meta - fixed 300px to prevent collapse (checkpoint 4 fix!) */}
                <div className="flex gap-4 md:w-[300px] shrink-0 items-start">
                  <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <Badge variant="age-rating" ratingType={movie.ageRating} />
                    <Link href={`/movies/${movie.id}`} className="hover:text-primary transition-colors block">
                      <h3 className="text-sm font-extrabold tracking-tight leading-tight line-clamp-2 text-foreground">
                        {movie.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                      <Clock size={12} />
                      <span>{movie.duration} phút</span>
                    </div>
                  </div>
                </div>

                {/* Right: Grouped slot times by Cinema */}
                <div className="flex-1 w-full space-y-5 border-t md:border-t-0 md:border-l border-border/60 pt-5 md:pt-0 md:pl-6">
                  {cinemas.map(({ cinema, slots }) => {
                    if (!cinema) return null;
                    return (
                      <div key={cinema.id} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-extrabold">
                          <MapPin size={12} className="text-primary shrink-0" />
                          <span>{cinema.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {slots.map((showtime) => (
                            <Link key={showtime.id} href={`/booking/${showtime.id}`}>
                              <button className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[70px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                                {showtime.time}
                              </button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })
        ) : (
          <Card variant="flat" className="py-16 text-center">
            <EmptyState
              icon={<Calendar size={32} weight="light" />}
              title="Không tìm thấy suất chiếu nào"
              description="Hiện tại không có suất chiếu nào phù hợp với bộ lọc ngày và rạp đã chọn. Vui lòng chọn một ngày khác."
            />
          </Card>
        )}
      </div>

    </main>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense fallback={<Loading size="lg" className="py-32" />}>
      <ShowtimesContent />
    </Suspense>
  );
}
