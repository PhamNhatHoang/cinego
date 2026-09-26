"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { movieApi } from "@/lib/api-services";
import type { Movie as ApiMovie } from "@/lib/types";
import type { Movie } from "@/features/home/types/home.types";
import { MovieCard } from "@/features/movies/components/MovieCard";
import { Input, Tabs, EmptyState, Loading, Card } from "@/components/ui";
import { MagnifyingGlass, FilmSlate, Calendar, Funnel } from "@phosphor-icons/react";

/** Map API Movie → Home Movie type for MovieCard component */
function toHomeMovie(m: ApiMovie): Movie {
  return {
    id: String(m.id),
    title: m.title,
    description: m.description || "",
    posterUrl: m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400",
    backdropUrl: m.trailerUrl || m.posterUrl || "",
    genre: m.genres || [],
    duration: m.duration,
    releaseDate: m.releaseDate || "",
    ageRating: m.rated || "P",
    rating: undefined,
    status: m.status === "UPCOMING" ? "UPCOMING" : "NOW_SHOWING",
  };
}

const ALL_GENRES = [
  "Tất cả",
  "Hành động",
  "Phiêu lưu",
  "Khoa học Viễn tưởng",
  "Hoạt hình",
  "Gia đình",
  "Nhạc kịch",
  "Giật gân",
  "Hồi hộp",
  "Bí ẩn",
  "Hài hước",
  "Kịch tính"
];

function MoviesListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "now-showing";
  const genreParam = searchParams.get("genre") || "Tất cả";

  const [searchVal, setSearchVal] = useState(queryParam);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from API
  useEffect(() => {
    movieApi
      .getAll()
      .then((data) => setAllMovies(data.map(toHomeMovie)))
      .catch(() => setAllMovies([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  const tabOptions = [
    { id: "now-showing", label: "Phim đang chiếu", icon: <FilmSlate size={16} /> },
    { id: "upcoming", label: "Phim sắp chiếu", icon: <Calendar size={16} /> },
  ];

  const updateParams = (updates: { q?: string; status?: string; genre?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.q !== undefined) {
      if (updates.q) params.set("q", updates.q);
      else params.delete("q");
    }
    if (updates.status !== undefined) params.set("status", updates.status);
    if (updates.genre !== undefined) {
      if (updates.genre !== "Tất cả") params.set("genre", updates.genre);
      else params.delete("genre");
    }
    router.push(`/movies?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchVal.trim() });
  };

  const handleTabChange = (tabId: string) => updateParams({ status: tabId });
  const handleGenreClick = (genre: string) => updateParams({ genre });

  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      const matchStatus =
        statusParam === "now-showing"
          ? movie.status === "NOW_SHOWING"
          : movie.status === "UPCOMING";
      const matchQuery =
        !queryParam ||
        movie.title.toLowerCase().includes(queryParam.toLowerCase()) ||
        movie.description.toLowerCase().includes(queryParam.toLowerCase());
      const matchGenre =
        genreParam === "Tất cả" || movie.genre.includes(genreParam);
      return matchStatus && matchQuery && matchGenre;
    });
  }, [allMovies, statusParam, queryParam, genreParam]);

  const handleClearFilters = () => {
    setSearchVal("");
    router.push("/movies");
  };

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 min-h-[calc(100vh-16rem)]">
        <div className="flex justify-center py-20"><Loading size="lg" /></div>
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-24 space-y-8 min-h-[calc(100vh-16rem)]">
      <div className="space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Danh Sách Phim</h1>
        <p className="text-xs text-muted-foreground">
          Khám phá những tựa phim bom tấn đỉnh cao đang chiếu hoặc sắp khởi chiếu tại rạp.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs options={tabOptions} activeTabId={statusParam} onTabChange={handleTabChange} variant="pills" />
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Input
            placeholder="Tìm kiếm phim..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            leftIcon={<MagnifyingGlass size={16} />}
            className="rounded-xl pr-10"
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => { setSearchVal(""); updateParams({ q: "" }); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold font-mono transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Funnel size={14} className="text-primary" />
          <span>Lọc theo thể loại:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_GENRES.map((genre) => {
            const isSelected = genreParam === genre;
            return (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm scale-102"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {(queryParam || genreParam !== "Tất cả") && (
        <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border rounded-2xl text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span>Đang hiển thị kết quả cho:</span>
            {queryParam && (
              <span className="px-2 py-0.5 rounded-lg bg-card border border-border font-bold text-foreground">
                Từ khóa &quot;{queryParam}&quot;
              </span>
            )}
            {genreParam !== "Tất cả" && (
              <span className="px-2 py-0.5 rounded-lg bg-card border border-border font-bold text-foreground">
                Thể loại &quot;{genreParam}&quot;
              </span>
            )}
          </div>
          <button onClick={handleClearFilters} className="text-primary hover:underline font-bold">
            Xóa bộ lọc
          </button>
        </div>
      )}

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <Card variant="double-bezel" className="py-16">
          <EmptyState
            title="Không tìm thấy phim phù hợp"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc thể loại khác."
            actionText="Xem tất cả phim"
            onAction={handleClearFilters}
          />
        </Card>
      )}
    </main>
  );
}

export default function MoviesPage() {
  return (
    <Suspense fallback={<Loading size="lg" className="py-32" />}>
      <MoviesListContent />
    </Suspense>
  );
}
