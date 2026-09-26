// ═══════════════════════════════════════════════════════
//  CineGo TypeScript Types — 1:1 mapping with Backend DTOs
// ═══════════════════════════════════════════════════════

/** Backend ApiResponse<T> envelope wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ── Cinema ──────────────────────────────────────────────

/** Maps to CinemaResponse.java */
export interface Cinema {
  id: number;
  name: string;
  address: string;
  hotline: string;
  totalAuditoriums: number;
}

// ── Movie ───────────────────────────────────────────────

/** Maps to MovieResponse.java */
export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  status: string;          // NOW_SHOWING | UPCOMING | ENDED
  genres: string[];
  posterUrl: string | null;
  trailerUrl: string | null;
  rated: string | null;    // P | T13 | T16 | T18
  releaseDate: string | null;
  director: string | null;
  cast: string | null;
  language: string | null;
}

// ── Auditorium ──────────────────────────────────────────

/** Maps to AuditoriumResponse.java */
export interface Auditorium {
  id: number;
  name: string;
  totalSeats: number;
  seatsCount: number;
  type: string;
  status: string;
  cinemaId: number;
  cinemaName: string;
  seats: Seat[];
}

// ── Seat ────────────────────────────────────────────────

/** Maps to SeatResponse.java */
export interface Seat {
  id: number;
  rowName: string;
  seatNumber: number;
  seatCode: string;        // e.g. "A1", "F5"
  type: "STANDARD" | "VIP" | "COUPLE";
  occupied: boolean;
}

// ── Showtime ────────────────────────────────────────────

/** Maps to ShowtimeResponse.java */
export interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  moviePosterUrl: string | null;
  movieDuration: number;
  movieAgeRating: string | null;
  cinemaId: number;
  cinemaName: string;
  cinemaAddress: string;
  auditoriumId: number;
  auditoriumName: string;
  startTime: string;       // ISO DateTime
  endTime: string;
  basePrice: number;
  status: string;
  occupiedSeatIds: number[];
  seats: Seat[];
}

// ── Booking ─────────────────────────────────────────────

/** Maps to BookingResponse.java */
export interface Booking {
  id: number;
  bookingCode: string;
  showtimeId: number;
  movieTitle: string;
  moviePosterUrl: string | null;
  cinemaName: string;
  cinemaAddress: string;
  auditoriumName: string;
  startTime: string;
  endTime: string;
  seatNames: string[];
  seatIds: number[];
  totalAmount: number;
  status: string;          // PENDING | PAID | CANCELLED
  createdAt: string;
  expiresAt: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  tickets: Ticket[];
}

// ── Ticket ──────────────────────────────────────────────

/** Maps to TicketResponse.java */
export interface Ticket {
  id: number;
  ticketCode: string;
  bookingId: number;
  bookingCode: string;
  movieTitle: string;
  moviePosterUrl: string | null;
  movieDuration: number;
  movieAgeRating: string | null;
  cinemaName: string;
  cinemaAddress: string;
  auditoriumName: string;
  seatId: number;
  seatName: string;
  seatType: string;
  price: number;
  startTime: string;
  endTime: string;
  status: string;          // VALID | USED | CANCELLED
  checkedInAt: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  qrCodeData: string;
}

// ── Dashboard ───────────────────────────────────────────

/** Maps to DashboardResponse.java */
export interface DashboardStats {
  totalMovies: number;
  totalTicketsSold: number;
  totalUsers: number;
  totalRevenue: number;
  activeMovies: number;
  upcomingMovies: number;
  occupancyRate: number;
  revenueGrowthPercent: number;
  checkedInToday: number;
  revenueByMovie: Record<string, number>;
  weeklyRevenue: { day: string; revenue: number }[];
  cinemaSales: { name: string; sales: number }[];
  recentBookings: RecentBooking[];
}

export interface RecentBooking {
  id: number;
  bookingCode: string;
  movieTitle: string;
  seatNames: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

// ── Auth ────────────────────────────────────────────────

/** Maps to AuthResponse.java */
export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

// ── Request DTOs ────────────────────────────────────────

export interface BookingRequest {
  showtimeId: number;
  seatIds: number[];
}

export interface ShowtimeRequest {
  movieId: number;
  auditoriumId?: number;
  cinemaId?: number;
  startTime: string;        // ISO DateTime
  basePrice?: number;
}

export interface MockPaymentRequest {
  paymentMethod: string;
}
