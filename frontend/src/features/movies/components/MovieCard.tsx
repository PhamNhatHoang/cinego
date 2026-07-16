"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/features/home/types/home.types";
import { Badge, Button } from "@/components/ui";
import { Star, Clock, Ticket, Info } from "@phosphor-icons/react";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const isNowShowing = movie.status === "NOW_SHOWING";

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border border-border/80 overflow-hidden shadow-soft hover:shadow-lg dark:hover:shadow-rose-500/5 transition-all duration-300">
      {/* Movie Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized // To support unsplash mock urls cleanly
        />

        {/* Badges Overlaid */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <Badge variant="age-rating" ratingType={movie.ageRating} />
        </div>

        {movie.rating && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-[4px] border border-white/10 text-yellow-400 text-[10px] font-extrabold font-mono">
            <Star size={10} weight="fill" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Floating Action Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3 p-4 z-20">
          {isNowShowing ? (
            <Link href={`/booking/${movie.id}`} className="w-full max-w-[150px]">
              <Button variant="primary" size="sm" className="w-full" leftIcon={<Ticket size={14} />}>
                Mua Vé
              </Button>
            </Link>
          ) : (
            <Link href={`/movies/${movie.id}`} className="w-full max-w-[150px]">
              <Button variant="secondary" size="sm" className="w-full bg-white text-black border-none hover:bg-white/90" leftIcon={<Info size={14} />}>
                Chi Tiết
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Movie Meta Information */}
      <div className="flex-1 p-4 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1">
          <Link href={`/movies/${movie.id}`} className="hover:text-primary transition-colors block">
            <h4 className="text-sm font-extrabold tracking-tight line-clamp-1 text-foreground">
              {movie.title}
            </h4>
          </Link>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-0.5 shrink-0">
              <Clock size={12} />
              <span>{movie.duration} phút</span>
            </span>
            <span>•</span>
            <span className="truncate">{movie.genre.join(", ")}</span>
          </div>
        </div>

        {/* Release Date info & Action Button on Mobile (No Hover) */}
        <div className="pt-2.5 border-t border-border/60 flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            Khởi chiếu: <span className="font-bold text-foreground/80">{movie.releaseDate}</span>
          </span>
          <div className="md:hidden shrink-0">
            {isNowShowing ? (
              <Link href={`/booking/${movie.id}`}>
                <Button variant="primary" size="xs">
                  Đặt vé
                </Button>
              </Link>
            ) : (
              <Link href={`/movies/${movie.id}`}>
                <Button variant="outline" size="xs">
                  Xem
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
