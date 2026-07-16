"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MOCK_MOVIES } from "@/mocks/home-mock-data";
import { MovieCard } from "@/features/movies/components/MovieCard";
import { Input, Tabs, EmptyState, Loading, Card } from "@/components/ui";
import { MagnifyingGlass, FilmSlate, Calendar, Funnel } from "@phosphor-icons/react";

// Get list of all unique genres from mock data
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

  // Read URL query params
  const queryParam = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "now-showing";
  const genreParam = searchParams.get("genre") || "Tất cả";

  // Internal states
  const [searchVal, setSearchVal] = useState(queryParam);

  // Sync state with URL parameter changes (e.g. from header search)
  useEffect(() => {
    setSearchVal(queryParam);
  }, [queryParam]);

  // Set up tab options
  const tabOptions = [
    { id: "now-showing", label: "Phim đang chiếu", icon: <FilmSlate size={16} /> },
    { id: "upcoming", label: "Phim sắp chiếu", icon: <Calendar size={16} /> },
  ];

  // Handle updates to URL query parameters
  const updateParams = (updates: { q?: string; status?: string; genre?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.q !== undefined) {
      if (updates.q) params.set("q", updates.q);
      else params.delete("q");
    }
    
    if (updates.status !== undefined) {
      params.set("status", updates.status);
    }
    
    if (updates.genre !== undefined) {
      if (updates.genre !== "Tất cả") params.set("genre", updates.genre);
      else params.delete("genre");
    }

    router.push(`/movies?${params.toString()}`);
  };

  // Perform search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchVal.trim() });
  };

  // Handle Tab Switch
  const handleTabChange = (tabId: string) => {
    updateParams({ status: tabId });
  };

  // Handle Genre Tag click
  const handleGenreClick = (genre: string) => {
    updateParams({ genre });
  };

  // Filter movies based on status, search string, and genre
  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter((movie) => {
      // 1. Filter by Status
      const matchStatus =
        statusParam === "now-showing"
          ? movie.status === "NOW_SHOWING"
          : movie.status === "UPCOMING";

      // 2. Filter by Search Query
      const matchQuery =
        !queryParam ||
        movie.title.toLowerCase().includes(queryParam.toLowerCase()) ||
        movie.description.toLowerCase().includes(queryParam.toLowerCase());

      // 3. Filter by Genre
      const matchGenre =
        genreParam === "Tất cả" || movie.genre.includes(genreParam);

      return matchStatus && matchQuery && matchGenre;
    });
  }, [statusParam, queryParam, genreParam]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchVal("");
    router.push("/movies");
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-24 space-y-8 min-h-[calc(100vh-16rem)]">
      
      {/* Title & Description */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Danh Sách Phim
        </h1>
        <p className="text-xs text-muted-foreground">
          Khám phá những tựa phim bom tấn đỉnh cao đang chiếu hoặc sắp khởi chiếu tại rạp.
        </p>
      </div>

      {/* Filters & Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Status Tabs */}
        <Tabs
          options={tabOptions}
          activeTabId={statusParam}
          onTabChange={handleTabChange}
          variant="pills"
        />

        {/* Right Side: Search Input */}
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
              onClick={() => {
                setSearchVal("");
                updateParams({ q: "" });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-bold font-mono transition-colors"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Genre Filter List */}
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

      {/* Active filters summary */}
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
          <button
            onClick={handleClearFilters}
            className="text-primary hover:underline font-bold"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Movies Grid */}
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
