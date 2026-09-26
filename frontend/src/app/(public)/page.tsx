"use client";

import { useEffect, useState } from "react";
import { movieApi } from "@/lib/api-services";
import type { Movie as ApiMovie } from "@/lib/types";
import type { Movie } from "@/features/home/types/home.types";
import {
  HomeHero,
  QuickBooking,
  NowShowingSection,
  UpcomingMoviesSection,
  FeaturedShowtimes,
  CinemaExperience,
  HomeCallToAction
} from "@/features/home";
import { Loading } from "@/components/ui";

/** Map API Movie → Home Movie type for existing components */
function toHomeMovie(m: ApiMovie): Movie {
  return {
    id: String(m.id),
    title: m.title,
    description: m.description || "",
    posterUrl: m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400",
    backdropUrl: m.trailerUrl || m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200",
    genre: m.genres || [],
    duration: m.duration,
    releaseDate: m.releaseDate || "",
    ageRating: m.rated || "P",
    rating: undefined,
    status: m.status === "UPCOMING" ? "UPCOMING" : "NOW_SHOWING",
  };
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    movieApi
      .getAll()
      .then((data) => {
        setMovies(data.map(toHomeMovie));
      })
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        setMovies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    );
  }

  const featuredMovie = movies[0];
  const nowShowingMovies = movies.filter((m) => m.status === "NOW_SHOWING");
  const upcomingMovies = movies.filter((m) => m.status === "UPCOMING");

  return (
    <div className="flex flex-col w-full min-h-screen">
      {featuredMovie && <HomeHero movie={featuredMovie} />}
      <QuickBooking />
      <NowShowingSection movies={nowShowingMovies} />
      <UpcomingMoviesSection movies={upcomingMovies} />
      <FeaturedShowtimes />
      <CinemaExperience />
      <HomeCallToAction />
    </div>
  );
}
