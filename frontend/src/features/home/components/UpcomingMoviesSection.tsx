"use client";

import { Movie } from "../types/home.types";
import { CalendarBlank, Eye } from "@phosphor-icons/react";
import Link from "next/link";

interface UpcomingMoviesSectionProps {
  movies: Movie[];
}

export default function UpcomingMoviesSection({ movies }: UpcomingMoviesSectionProps) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 space-y-8 bg-card/10 border-t border-b border-border/40 w-full">
      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex justify-between items-end border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Phim Sắp Chiếu</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Đón đầu các siêu phẩm bom tấn sắp ra mắt tại rạp CineGo toàn quốc
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground uppercase">COMMING SOON</span>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="group flex flex-col space-y-3">
              
              {/* Poster Container */}
              <div className="p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-border group-hover:border-primary/40 transition-all duration-300">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[calc(1.5rem-0.25rem)] bg-muted">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Age Rating Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white border border-primary/20 font-mono uppercase tracking-wider">
                      Sắp chiếu
                    </span>
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 z-20">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 cursor-pointer shadow-md"
                    >
                      <Eye size={14} />
                      <span>Xem chi tiết</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="space-y-1.5 px-1">
                <h3 className="font-bold text-sm md:text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                
                <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground font-medium">
                  {movie.genre.slice(0, 2).map((g, i) => (
                    <span key={i} className="bg-muted px-1.5 py-0.5 rounded border border-border/40">
                      {g}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-primary font-semibold">
                  <CalendarBlank size={14} />
                  <span>Khởi chiếu: {movie.releaseDate}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
