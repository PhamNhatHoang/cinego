"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MOCK_MOVIES, MOCK_CINEMAS, MOCK_SHOWTIMES } from "@/mocks/home-mock-data";
import { Badge, Button, Card, EmptyState, Breadcrumb } from "@/components/ui";
import { Star, Clock, Ticket, Calendar, MapPin, Play, User, Users } from "@phosphor-icons/react";

interface MovieDetailPageProps {
  params: {
    movieId: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const router = useRouter();
  const { movieId } = params;

  // Find the current movie
  const movie = useMemo(() => {
    return MOCK_MOVIES.find((m) => m.id === movieId);
  }, [movieId]);

  // Selected date filter
  const [selectedDate, setSelectedDate] = useState("2026-07-16");

  // Showtimes for this movie
  const movieShowtimes = useMemo(() => {
    return MOCK_SHOWTIMES.filter((s) => s.movieId === movieId);
  }, [movieId]);

  // Dates for filter
  const dateOptions = [
    { value: "2026-07-16", label: "T5", dateNum: "16", month: "Th 7" },
    { value: "2026-07-17", label: "T6", dateNum: "17", month: "Th 7" },
    { value: "2026-07-18", label: "T7", dateNum: "18", month: "Th 7" },
  ];

  // Group showtimes by cinema for the selected date
  const groupedShowtimes = useMemo(() => {
    const showtimesForDate = movieShowtimes.filter((s) => s.date === selectedDate);
    
    const groups: { [cinemaId: string]: typeof showtimesForDate } = {};
    showtimesForDate.forEach((showtime) => {
      if (!groups[showtime.cinemaId]) {
        groups[showtime.cinemaId] = [];
      }
      groups[showtime.cinemaId].push(showtime);
    });

    return Object.keys(groups).map((cinemaId) => {
      const cinema = MOCK_CINEMAS.find((c) => c.id === cinemaId);
      return {
        cinema,
        showtimes: groups[cinemaId].sort((a, b) => a.time.localeCompare(b.time)),
      };
    });
  }, [movieShowtimes, selectedDate]);

  if (!movie) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 min-h-[calc(100vh-16rem)]">
        <EmptyState
          title="Không tìm thấy phim"
          description="Rất tiếc, bộ phim bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ."
          actionText="Quay lại danh sách phim"
          onAction={() => router.push("/movies")}
        />
      </main>
    );
  }

  const breadcrumbItems = [
    { label: "Danh sách phim", href: "/movies" },
    { label: movie.title },
  ];

  const isNowShowing = movie.status === "NOW_SHOWING";

  return (
    <main className="min-h-screen pb-24 w-full">
      {/* 1. Backdrop Banner */}
      <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden bg-black select-none">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-[2px]"
          unoptimized
        />
        {/* Dark Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10 hidden md:block" />
      </div>

      {/* 2. Movie Info Container */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-36 md:-mt-48 relative z-20 space-y-12">
        
        {/* Breadcrumbs for better UX */}
        <Breadcrumb items={breadcrumbItems} className="mb-4 bg-black/30 backdrop-blur-[4px] border border-white/5 p-2 px-4 rounded-full w-fit" />

        <div className="flex flex-col md:flex-row gap-8 md:items-end">
          {/* Movie Poster */}
          <div className="relative w-48 md:w-64 aspect-[2/3] rounded-[2rem] overflow-hidden border border-border shadow-2xl bg-card shrink-0 mx-auto md:mx-0">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="(max-w-768px) 192px, 256px"
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Movie Details Text */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2.5">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="age-rating" ratingType={movie.ageRating} />
                <Badge variant="outline">{isNowShowing ? "Đang chiếu" : "Sắp chiếu"}</Badge>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-semibold">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-primary" />
                  <span>{movie.duration} phút</span>
                </span>
                <span>•</span>
                <span>{movie.genre.join(", ")}</span>
                {movie.rating && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star size={14} weight="fill" />
                      <span className="text-foreground font-bold font-mono">{movie.rating.toFixed(1)}/10</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* CTA Quick Jump Button */}
            {isNowShowing && (
              <div className="pt-2">
                <a href="#showtimes-section">
                  <Button variant="primary" className="px-8 shadow-rose-500/20" leftIcon={<Ticket size={16} />}>
                    Đặt Vé Ngay
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 3. Detailed Meta Tabs & Description Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Description (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="flat" className="p-6 md:p-8 space-y-4">
              <h3 className="text-base font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Tóm tắt nội dung
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                {movie.description}
              </p>
            </Card>

            {/* Mock YouTube Video Trailer placeholder */}
            <Card variant="flat" className="p-6 md:p-8 space-y-4">
              <h3 className="text-base font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Trailer phim
              </h3>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/90 border border-border group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                    <Play size={24} weight="fill" className="ml-1" />
                  </div>
                </div>
                {/* Backdrop mock image in frame */}
                <Image
                  src={movie.backdropUrl}
                  alt="Trailer Preview"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  unoptimized
                />
              </div>
            </Card>
          </div>

          {/* Business Meta Info (Right col) */}
          <div className="space-y-6">
            <Card variant="flat" className="p-6 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Thông tin sản xuất
              </h3>
              <div className="space-y-3.5 pt-1">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Khởi chiếu</span>
                  </span>
                  <span className="font-bold text-foreground font-mono">{movie.releaseDate}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Thời lượng</span>
                  </span>
                  <span className="font-bold text-foreground">{movie.duration} phút</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <User size={14} />
                    <span>Đạo diễn</span>
                  </span>
                  <span className="font-bold text-foreground">Mock Director</span>
                </div>
                <div className="flex justify-between items-start py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5 shrink-0">
                    <Users size={14} />
                    <span>Diễn viên</span>
                  </span>
                  <span className="font-bold text-foreground text-right max-w-[20ch] leading-relaxed">
                    Mock Actor 1, Mock Actor 2, Mock Actor 3
                  </span>
                </div>
              </div>
            </Card>
          </div>

        </div>

        {/* 4. Showtimes Section */}
        {isNowShowing && (
          <div id="showtimes-section" className="space-y-6 scroll-mt-24">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground uppercase tracking-wider">
                Lịch Chiếu & Suất Chiếu
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Chọn rạp và khung giờ phù hợp để tiến hành giữ chỗ và đặt vé trực tuyến nhanh chóng.
              </p>
            </div>

            {/* Date Switched Pills */}
            <div className="flex items-center gap-3">
              {dateOptions.map((date) => {
                const isSelected = selectedDate === date.value;
                return (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl border transition-all duration-300 min-w-[70px] select-none ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10 scale-102"
                        : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase opacity-80">{date.label}</span>
                    <span className="text-lg font-extrabold font-mono mt-0.5">{date.dateNum}</span>
                    <span className="text-[9px] opacity-75">{date.month}</span>
                  </button>
                );
              })}
            </div>

            {/* Showtimes Grid grouped by Cinema */}
            <div className="space-y-4">
              {groupedShowtimes.length > 0 ? (
                groupedShowtimes.map(({ cinema, showtimes }) => {
                  if (!cinema) return null;
                  return (
                    <Card key={cinema.id} variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/60 pb-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold tracking-tight text-foreground">
                            {cinema.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin size={12} className="text-primary shrink-0" />
                            <span>{cinema.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Showtime Buttons grid */}
                      <div className="flex flex-wrap gap-3 pt-1">
                        {showtimes.map((showtime) => (
                          <Link key={showtime.id} href={`/booking/${showtime.id}`}>
                            <button className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[80px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
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
                    title="Không có suất chiếu"
                    description="Rất tiếc, bộ phim hiện không có suất chiếu nào vào ngày đã chọn. Vui lòng chọn ngày khác."
                  />
                </Card>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
