"use client";

import { Movie } from "../types/home.types";
import { Play, Ticket, Star, Clock } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface HomeHeroProps {
  movie: Movie;
}

export default function HomeHero({ movie }: HomeHeroProps) {
  const handleBookClick = () => {
    const element = document.getElementById("quick-booking-bar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center overflow-hidden bg-black select-none">
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center opacity-45 scale-105"
        />
        {/* Left Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-10 hidden md:block w-3/4" />
        {/* Bottom Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        {/* Universal Dark Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />
      </div>

      {/* Hero Content Panel */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-6 md:px-12 flex flex-col items-start gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 max-w-[650px]"
        >
          {/* Badge List */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-primary text-white uppercase tracking-wider">
              Phim Tiêu Điểm
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 border border-white/15 text-white">
              {movie.ageRating}
            </span>
            {movie.rating && (
              <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                <Star size={16} weight="fill" />
                <span>{movie.rating}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-white/70 text-xs font-medium">
              <Clock size={16} />
              <span>{movie.duration} phút</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white font-sans drop-shadow-md">
            {movie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 text-xs text-primary font-semibold">
            {movie.genre.map((g, i) => (
              <span key={i}>#{g}</span>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm md:text-base leading-relaxed drop-shadow">
            {movie.description}
          </p>

          {/* CTA Buttons (Island CTA Style) */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleBookClick}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all duration-300 group active:scale-95 cursor-pointer shadow-lg shadow-primary/30"
            >
              <span>Đặt vé ngay</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                <Ticket size={16} weight="bold" />
              </div>
            </button>

            <button
              onClick={() => alert("Chức năng xem trailer đang phát triển.")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all"
            >
              <Play size={16} weight="fill" />
              <span>Xem trailer</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
