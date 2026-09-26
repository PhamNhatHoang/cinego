"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { movieApi, showtimeApi } from "@/lib/api-services";
import type { Movie as ApiMovie, Showtime as ApiShowtime } from "@/lib/types";
import { Badge, Button, Card, EmptyState, Breadcrumb, Loading } from "@/components/ui";
import { Star, Clock, Ticket, Calendar, MapPin, Play, User, Users } from "@phosphor-icons/react";

interface MovieDetailPageProps {
  params: {
    movieId: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const router = useRouter();
  const { movieId } = params;

  const [movie, setMovie] = useState<ApiMovie | null>(null);
  const [showtimes, setShowtimes] = useState<ApiShowtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate date options dynamically
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

  // Fetch movie detail
  useEffect(() => {
    movieApi
      .getById(Number(movieId))
      .then(setMovie)
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [movieId]);

  // Fetch showtimes for this movie + selected date
  useEffect(() => {
    if (!selectedDate) return;
    showtimeApi
      .search({ movieId: Number(movieId), date: selectedDate })
      .then(setShowtimes)
      .catch(() => setShowtimes([]));
  }, [movieId, selectedDate]);

  // Group showtimes by cinema
  const groupedShowtimes = useMemo(() => {
    const groups: Record<number, { cinemaId: number; cinemaName: string; cinemaAddress: string; slots: { id: number; time: string }[] }> = {};
    showtimes.forEach((s) => {
      if (!groups[s.cinemaId]) {
        groups[s.cinemaId] = {
          cinemaId: s.cinemaId,
          cinemaName: s.cinemaName,
          cinemaAddress: s.cinemaAddress,
          slots: [],
        };
      }
      groups[s.cinemaId].slots.push({
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
  const posterUrl = movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400";
  const backdropUrl = movie.trailerUrl || movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200";

  return (
    <main className="min-h-screen pb-24 w-full">
      {/* 1. Backdrop Banner */}
      <div className="relative h-[40vh] md:h-[55vh] w-full overflow-hidden bg-black select-none">
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 blur-[2px]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10 hidden md:block" />
      </div>

      {/* 2. Movie Info Container */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-36 md:-mt-48 relative z-20 space-y-12">
        
        <Breadcrumb items={breadcrumbItems} className="mb-4 bg-black/30 backdrop-blur-[4px] border border-white/5 p-2 px-4 rounded-full w-fit" />

        <div className="flex flex-col md:flex-row gap-8 md:items-end">
          <div className="relative w-48 md:w-64 aspect-[2/3] rounded-[2rem] overflow-hidden border border-border shadow-2xl bg-card shrink-0 mx-auto md:mx-0">
            <Image src={posterUrl} alt={movie.title} fill sizes="(max-w-768px) 192px, 256px" className="object-cover" unoptimized />
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="age-rating" ratingType={movie.rated || "P"} />
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
                <span>{(movie.genres || []).join(", ")}</span>
              </div>
            </div>

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

        {/* 3. Detailed Meta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="flat" className="p-6 md:p-8 space-y-4">
              <h3 className="text-base font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Tóm tắt nội dung
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                {movie.description}
              </p>
            </Card>

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
                <Image src={backdropUrl} alt="Trailer Preview" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" unoptimized />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="flat" className="p-6 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold tracking-tight text-foreground border-b border-border/60 pb-3 uppercase tracking-wider">
                Thông tin sản xuất
              </h3>
              <div className="space-y-3.5 pt-1">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5"><Calendar size={14} /><span>Khởi chiếu</span></span>
                  <span className="font-bold text-foreground font-mono">{movie.releaseDate || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5"><Clock size={14} /><span>Thời lượng</span></span>
                  <span className="font-bold text-foreground">{movie.duration} phút</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5"><User size={14} /><span>Đạo diễn</span></span>
                  <span className="font-bold text-foreground">{movie.director || "Đang cập nhật"}</span>
                </div>
                <div className="flex justify-between items-start py-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5 shrink-0"><Users size={14} /><span>Diễn viên</span></span>
                  <span className="font-bold text-foreground text-right max-w-[20ch] leading-relaxed">
                    {movie.cast || "Đang cập nhật"}
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
              <h2 className="text-xl font-extrabold tracking-tight text-foreground uppercase tracking-wider">Lịch Chiếu & Suất Chiếu</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Chọn rạp và khung giờ phù hợp để tiến hành giữ chỗ và đặt vé trực tuyến nhanh chóng.
              </p>
            </div>

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

            <div className="space-y-4">
              {groupedShowtimes.length > 0 ? (
                groupedShowtimes.map((cinemaData) => (
                  <Card key={cinemaData.cinemaId} variant="double-bezel" className="p-0 border-none" innerClassName="p-6 md:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/60 pb-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold tracking-tight text-foreground">{cinemaData.cinemaName}</h4>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <MapPin size={12} className="text-primary shrink-0" />
                          <span>{cinemaData.cinemaAddress}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {cinemaData.slots.sort((a, b) => a.time.localeCompare(b.time)).map((slot) => (
                        <Link key={slot.id} href={`/booking/${slot.id}`}>
                          <button className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-primary hover:text-white hover:border-primary text-foreground text-xs font-mono font-extrabold min-w-[80px] text-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer">
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
