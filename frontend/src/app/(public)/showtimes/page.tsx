"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { movieApi, cinemaApi, showtimeApi } from "@/lib/api-services";
import type { Movie as ApiMovie, Cinema as ApiCinema, Showtime as ApiShowtime } from "@/lib/types";
import { Badge, Button, Card, EmptyState, Loading, Select } from "@/components/ui";
import { Clock, Calendar, Ticket, MapPin, Funnel } from "@phosphor-icons/react";

function ShowtimesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query params
  const today = new Date().toISOString().split("T")[0];
  const dateParam = searchParams.get("date") || today;
  const cinemaParam = searchParams.get("cinemaId") || "Tất cả";

  // State
  const [cinemas, setCinemas] = useState<ApiCinema[]>([]);
  const [showtimes, setShowtimes] = useState<ApiShowtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate 7 dates from today
  const dateOptions = useMemo(() => {
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      result.push({
        value: d.toISOString().split("T")[0],
        label: weekdays[d.getDay()],
        dateNum: String(d.getDate()).padStart(2, "0"),
        month: `Th ${d.getMonth() + 1}`,
      });
    }
    return result;
  }, []);

  // Fetch cinemas once
  useEffect(() => {
    cinemaApi.getAll().then(setCinemas).catch(() => setCinemas([]));
  }, []);

  // Fetch showtimes when date or cinema changes
  useEffect(() => {
    setLoading(true);
    const params: { date?: string; cinemaId?: number } = { date: dateParam };
    if (cinemaParam !== "Tất cả") {
      params.cinemaId = Number(cinemaParam);
    }
    showtimeApi
      .search(params)
      .then(setShowtimes)
      .catch(() => setShowtimes([]))
      .finally(() => setLoading(false));
  }, [dateParam, cinemaParam]);

  // Group showtimes by movie → cinema
  const moviesWithShowtimes = useMemo(() => {
    const movieMap: Record<
      number,
      {
        movieId: number;
        movieTitle: string;
        moviePosterUrl: string;
        movieDuration: number;
        movieAgeRating: string;
        cinemas: Record<
          number,
          {
            cinemaId: number;
            cinemaName: string;
            slots: { id: number; time: string }[];
          }
        >;
      }
    > = {};

    showtimes.forEach((s) => {
      if (!movieMap[s.movieId]) {
        movieMap[s.movieId] = {
          movieId: s.movieId,
          movieTitle: s.movieTitle,
          moviePosterUrl: s.moviePosterUrl || "",
          movieDuration: s.movieDuration,
          movieAgeRating: s.movieAgeRating || "P",
          cinemas: {},
        };
      }
      if (!movieMap[s.movieId].cinemas[s.cinemaId]) {
        movieMap[s.movieId].cinemas[s.cinemaId] = {
          cinemaId: s.cinemaId,
          cinemaName: s.cinemaName,
          slots: [],
        };
      }
      movieMap[s.movieId].cinemas[s.cinemaId].slots.push({
        id: s.id,
        time: new Date(s.startTime).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    return Object.values(movieMap);
  }, [showtimes]);

  // URL updates
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
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={String(cinema.id)}>
                {cinema.name}
              </option>
            ))}
          </Select>
        </div>

      </div>

      {/* Showtimes List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loading size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {moviesWithShowtimes.length > 0 ? (
            moviesWithShowtimes.map((movieData) => (
              <Card
                key={movieData.movieId}
                variant="double-bezel"
                className="p-0 border-none"
                innerClassName="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Left: Movie poster & meta */}
                <div className="flex gap-4 md:w-[300px] shrink-0 items-start">
                  <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    {movieData.moviePosterUrl && (
                      <Image
                        src={movieData.moviePosterUrl}
                        alt={movieData.movieTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="space-y-1.5 pt-0.5">
                    <Badge variant="age-rating" ratingType={movieData.movieAgeRating} />
                    <Link href={`/movies/${movieData.movieId}`} className="hover:text-primary transition-colors block">
                      <h3 className="text-sm font-extrabold tracking-tight leading-tight line-clamp-2 text-foreground">
                        {movieData.movieTitle}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                      <Clock size={12} />
                      <span>{movieData.movieDuration} phút</span>
                    </div>
                  </div>
                </div>

                {/* Right: Grouped slot times by Cinema */}
                <div className="flex-1 w-full space-y-5 border-t md:border-t-0 md:border-l border-border/60 pt-5 md:pt-0 md:pl-6">
                  {Object.values(movieData.cinemas).map((cinemaData) => (
                    <div key={cinemaData.cinemaId} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-foreground font-extrabold">
                        <MapPin size={12} className="text-primary shrink-0" />
                        <span>{cinemaData.cinemaName}</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {cinemaData.slots
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((slot) => (
                            <Link key={slot.id} href={`/booking/${slot.id}`}>
                              <button className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[70px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                                {slot.time}
                              </button>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
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
      )}

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
