export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  duration: number; // tính bằng phút
  releaseDate: string;
  ageRating: string; // ví dụ: T13, T16, T18, P
  rating?: number; // ví dụ: 8.8
  status: "NOW_SHOWING" | "UPCOMING";
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  time: string; // ví dụ: 19:00
  date: string; // ví dụ: 2026-07-18
}
