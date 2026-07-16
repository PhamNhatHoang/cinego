"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MOCK_CINEMAS, MOCK_MOVIES, MOCK_SHOWTIMES } from "@/mocks/home-mock-data";
import { Card, Button, Badge, EmptyState, Breadcrumb } from "@/components/ui";
import { MapPin, Phone, Clock, Calendar, Ticket, Compass } from "@phosphor-icons/react";

interface CinemaDetailPageProps {
  params: {
    cinemaId: string;
  };
}

export default function CinemaDetailPage({ params }: CinemaDetailPageProps) {
  const router = useRouter();
  const { cinemaId } = params;

  // Find cinema details
  const cinema = useMemo(() => {
    return MOCK_CINEMAS.find((c) => c.id === cinemaId);
  }, [cinemaId]);

  // Selected date
  const [selectedDate, setSelectedDate] = useState("2026-07-16");

  // Filter and group showtimes for this cinema on the selected date by Movie
  const moviesWithShowtimes = useMemo(() => {
    const showtimesAtCinema = MOCK_SHOWTIMES.filter(
      (s) => s.cinemaId === cinemaId && s.date === selectedDate
    );

    // Group by MovieId
    const groups: { [movieId: string]: typeof showtimesAtCinema } = {};
    showtimesAtCinema.forEach((s) => {
      if (!groups[s.movieId]) {
        groups[s.movieId] = [];
      }
      groups[s.movieId].push(s);
    });

    return Object.keys(groups).map((movieId) => {
      const movie = MOCK_MOVIES.find((m) => m.id === movieId);
      return {
        movie,
        slots: groups[movieId].sort((a, b) => a.time.localeCompare(b.time)),
      };
    }).filter(item => item.movie !== undefined);
  }, [cinemaId, selectedDate]);

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

  const dateOptions = [
    { value: "2026-07-16", label: "T5", dateNum: "16", month: "Th 7" },
    { value: "2026-07-17", label: "T6", dateNum: "17", month: "Th 7" },
    { value: "2026-07-18", label: "T7", dateNum: "18", month: "Th 7" },
  ];

  const breadcrumbItems = [
    { label: "Danh sách rạp", href: "/cinemas" },
    { label: cinema.name },
  ];

  // Mock header background image for visual flair
  const cinemaBgImages: { [key: string]: string } = {
    "c-1": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200",
    "c-2": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1200",
    "c-3": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    "c-4": "https://images.unsplash.com/photo-1478720143022-385f704d3b79?auto=format&fit=crop&q=80&w=1200",
  };

  const bgImg = cinemaBgImages[cinema.id] || cinemaBgImages["c-1"];

  return (
    <main className="min-h-screen pb-24 w-full">
      {/* 1. Backdrop Banner */}
      <div className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden bg-black select-none">
        <Image
          src={bgImg}
          alt={cinema.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45 blur-[1px]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent z-10" />
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-24 md:-mt-32 relative z-20 space-y-10">
        
        {/* Breadcrumb info */}
        <Breadcrumb items={breadcrumbItems} className="mb-4 bg-black/30 backdrop-blur-[4px] border border-white/5 p-2 px-4 rounded-full w-fit" />

        {/* Cinema details card header */}
        <Card variant="flat" className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              {cinema.name}
            </h1>
            <div className="space-y-2 text-xs text-muted-foreground font-semibold leading-relaxed">
              <p className="flex items-start gap-1.5">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/95">{cinema.address}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <p className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" />
                  <span className="font-mono">1900 6006</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" />
                  <span>Mở cửa: 08:30 - 23:30</span>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Date & Showtime Grid and Info Sidebar Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Lịch chiếu (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-base font-extrabold text-foreground uppercase tracking-wider">
                Lịch chiếu suất chiếu
              </h2>
            </div>

            {/* Date selection pills */}
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

            {/* Showtimes list */}
            <div className="space-y-4">
              {moviesWithShowtimes.length > 0 ? (
                moviesWithShowtimes.map(({ movie, slots }) => {
                  if (!movie) return null;
                  return (
                    <Card
                      key={movie.id}
                      variant="double-bezel"
                      className="p-0 border-none"
                      innerClassName="p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start"
                    >
                      {/* Left: Movie info - fixed 250px (checkpoint 4 fix!) */}
                      <div className="flex gap-4 sm:w-[250px] shrink-0 items-start">
                        <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                          <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="space-y-1 pt-0.5">
                          <Badge variant="age-rating" ratingType={movie.ageRating} />
                          <Link href={`/movies/${movie.id}`} className="hover:text-primary transition-colors block">
                            <h4 className="text-xs font-extrabold tracking-tight leading-tight line-clamp-2 text-foreground">
                              {movie.title}
                            </h4>
                          </Link>
                          <div className="text-[10px] text-muted-foreground font-semibold">
                            {movie.duration} phút
                          </div>
                        </div>
                      </div>

                      {/* Right: Slot Times */}
                      <div className="flex-1 w-full flex flex-wrap gap-2.5 sm:border-l border-border/60 sm:pl-6 pt-3 sm:pt-0">
                        {slots.map((showtime) => (
                          <Link key={showtime.id} href={`/booking/${showtime.id}`}>
                            <button className="px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[70px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
                              {showtime.time}
                            </button>
                          </Link>
                        ))}
                      </div>
                    </Card>
                  );
                })
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

          {/* Right Column: Cinema Facilities & Information (1 col) */}
          <div className="space-y-6">
            <Card variant="flat" className="p-6 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Thông tin rạp chiếu
              </h3>
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
