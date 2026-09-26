"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cinemaApi, showtimeApi } from "@/lib/api-services";
import type { Cinema as ApiCinema, Showtime as ApiShowtime } from "@/lib/types";
import { Card, Button, Badge, EmptyState, Breadcrumb, Loading } from "@/components/ui";
import { MapPin, Phone, Clock, Calendar, Ticket, Compass } from "@phosphor-icons/react";

const CINEMA_BG_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1478720143022-385f704d3b79?auto=format&fit=crop&q=80&w=1200",
];

interface CinemaDetailPageProps {
  params: { cinemaId: string };
}

export default function CinemaDetailPage({ params }: CinemaDetailPageProps) {
  const router = useRouter();
  const { cinemaId } = params;

  const [cinema, setCinema] = useState<ApiCinema | null>(null);
  const [showtimes, setShowtimes] = useState<ApiShowtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic dates
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

  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.value || "");

  // Fetch cinema
  useEffect(() => {
    cinemaApi
      .getById(Number(cinemaId))
      .then(setCinema)
      .catch(() => setCinema(null))
      .finally(() => setLoading(false));
  }, [cinemaId]);

  // Fetch showtimes for this cinema + date
  useEffect(() => {
    if (!selectedDate) return;
    showtimeApi
      .search({ cinemaId: Number(cinemaId), date: selectedDate })
      .then(setShowtimes)
      .catch(() => setShowtimes([]));
  }, [cinemaId, selectedDate]);

  // Group showtimes by movie
  const moviesWithShowtimes = useMemo(() => {
    const groups: Record<number, { movieId: number; movieTitle: string; moviePosterUrl: string; movieDuration: number; movieAgeRating: string; slots: { id: number; time: string }[] }> = {};
    showtimes.forEach((s) => {
      if (!groups[s.movieId]) {
        groups[s.movieId] = {
          movieId: s.movieId,
          movieTitle: s.movieTitle,
          moviePosterUrl: s.moviePosterUrl || "",
          movieDuration: s.movieDuration,
          movieAgeRating: s.movieAgeRating || "P",
          slots: [],
        };
      }
      groups[s.movieId].slots.push({
        id: s.id,
        time: new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      });
    });
    return Object.values(groups);
  }, [showtimes]);

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 min-h-[calc(100vh-16rem)]">
        <div className="flex justify-center py-20"><Loading size="lg" /></div>
      </main>
    );
  }

  if (!cinema) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 min-h-[calc(100vh-16rem)]">
        <EmptyState
          title="Không tìm thấy rạp"
          description="Rất tiếc, rạp chiếu phim bạn đang tìm kiếm không tồn tại hoặc đã ngừng hoạt động."
          actionText="Quay lại danh sách rạp"
          onAction={() => router.push("/cinemas")}
        />
      </main>
    );
  }

  const bgImg = CINEMA_BG_IMAGES[(cinema.id - 1) % CINEMA_BG_IMAGES.length];
  const breadcrumbItems = [
    { label: "Danh sách rạp", href: "/cinemas" },
    { label: cinema.name },
  ];

  return (
    <main className="min-h-screen pb-24 w-full">
      {/* 1. Backdrop Banner */}
      <div className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden bg-black select-none">
        <Image src={bgImg} alt={cinema.name} fill priority sizes="100vw" className="object-cover opacity-45 blur-[1px]" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-24 md:-mt-32 relative z-20 space-y-10">
        <Breadcrumb items={breadcrumbItems} className="mb-4 bg-black/30 backdrop-blur-[4px] border border-white/5 p-2 px-4 rounded-full w-fit" />

        <Card variant="flat" className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">{cinema.name}</h1>
            <div className="space-y-2 text-xs text-muted-foreground font-semibold leading-relaxed">
              <p className="flex items-start gap-1.5">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/95">{cinema.address}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <p className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" />
                  <span className="font-mono">{cinema.hotline || "1900 6006"}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" />
                  <span>Mở cửa: 08:30 - 23:30</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Date & Showtime Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-base font-extrabold text-foreground uppercase tracking-wider">Lịch chiếu suất chiếu</h2>
            </div>

            {/* Date pills */}
            <div className="flex items-center gap-3">
              {dateOptions.map((date) => {
                const isSelected = selectedDate === date.value;
                return (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl border transition-all duration-300 min-w-[65px] select-none ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/15 scale-102"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase opacity-85">{date.label}</span>
                    <span className="text-base font-extrabold font-mono mt-0.5">{date.dateNum}</span>
                    <span className="text-[8px] opacity-75">{date.month}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtimes */}
            <div className="space-y-4">
              {moviesWithShowtimes.length > 0 ? (
                moviesWithShowtimes.map((movieData) => (
                  <Card key={movieData.movieId} variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex gap-4 sm:w-[250px] shrink-0 items-start">
                      <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                        {movieData.moviePosterUrl && (
                          <Image src={movieData.moviePosterUrl} alt={movieData.movieTitle} fill sizes="64px" className="object-cover" unoptimized />
                        )}
                      </div>
                      <div className="space-y-1 pt-0.5">
                        <Badge variant="age-rating" ratingType={movieData.movieAgeRating} />
                        <Link href={`/movies/${movieData.movieId}`} className="hover:text-primary transition-colors block">
                          <h4 className="text-xs font-extrabold tracking-tight leading-tight line-clamp-2 text-foreground">{movieData.movieTitle}</h4>
                        </Link>
                        <div className="text-[10px] text-muted-foreground font-semibold">{movieData.movieDuration} phút</div>
                      </div>
                    </div>

                    <div className="flex-1 w-full flex flex-wrap gap-2.5 sm:border-l border-border/60 sm:pl-6 pt-3 sm:pt-0">
                      {movieData.slots.sort((a, b) => a.time.localeCompare(b.time)).map((slot) => (
                        <Link key={slot.id} href={`/booking/${slot.id}`}>
                          <button className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[70px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                            {slot.time}
                          </button>
                        </Link>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <Card variant="flat" className="py-12 text-center">
                  <EmptyState
                    icon={<Calendar size={32} weight="light" />}
                    title="Không có suất chiếu nào"
                    description="Hiện tại rạp này chưa có lịch chiếu nào vào ngày đã chọn. Vui lòng chọn một ngày khác."
                  />
                </Card>
              )}
            </div>
          </div>

          {/* Right Column: Cinema Facilities */}
          <div className="space-y-6">
            <Card variant="flat" className="p-6 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">Thông tin rạp chiếu</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed pt-1">
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Bãi gửi xe tiện lợi</h4>
                  <p>Hỗ trợ gửi xe máy và xe ô tô rộng rãi, an toàn trong khuôn viên trung tâm thương mại hoặc tầng hầm rạp.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Hỗ trợ âm thanh Dolby Atmos & IMAX</h4>
                  <p>Rạp được trang bị phòng chiếu định dạng IMAX màn hình cong siêu khủng và hệ thống âm thanh vòm Dolby Atmos đỉnh cao.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground">Dịch vụ ăn uống Premium</h4>
                  <p>Quầy bắp nước CineGo cung cấp bắp phô mai, caramel chất lượng thượng hạng và nhiều lựa chọn thức uống mát lạnh.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
