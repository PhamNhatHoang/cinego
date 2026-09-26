// ═══════════════════════════════════════════════════════
//  CineGo API Services — Domain service functions
//  Maps 1:1 to backend controller endpoints
// ═══════════════════════════════════════════════════════

import { apiClient } from "./api-client";
import type {
  Movie,
  Cinema,
  Showtime,
  Booking,
  Ticket,
  DashboardStats,
  Auditorium,
  BookingRequest,
  ShowtimeRequest,
  MockPaymentRequest,
} from "./types";

// ── Movies (/movies) ───────────────────────────────────

export const movieApi = {
  getAll: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get<Movie[]>(`/movies${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiClient.get<Movie>(`/movies/${id}`),

  create: (data: Partial<Movie>) => apiClient.post<Movie>("/movies", data),

  update: (id: number, data: Partial<Movie>) =>
    apiClient.put<Movie>(`/movies/${id}`, data),

  delete: (id: number) => apiClient.delete<string>(`/movies/${id}`),
};

// ── Cinemas (/cinemas) ─────────────────────────────────

export const cinemaApi = {
  getAll: () => apiClient.get<Cinema[]>("/cinemas"),

  getById: (id: number) => apiClient.get<Cinema>(`/cinemas/${id}`),

  create: (data: Partial<Cinema>) => apiClient.post<Cinema>("/cinemas", data),

  update: (id: number, data: Partial<Cinema>) =>
    apiClient.put<Cinema>(`/cinemas/${id}`, data),

  delete: (id: number) => apiClient.delete<string>(`/cinemas/${id}`),
};

// ── Auditoriums (/auditoriums) ──────────────────────────

export const auditoriumApi = {
  getAll: (cinemaId?: number) => {
    const qs = cinemaId ? `?cinemaId=${cinemaId}` : "";
    return apiClient.get<Auditorium[]>(`/auditoriums${qs}`);
  },

  getById: (id: number) => apiClient.get<Auditorium>(`/auditoriums/${id}`),

  create: (data: Partial<Auditorium>) =>
    apiClient.post<Auditorium>("/auditoriums", data),

  update: (id: number, data: Partial<Auditorium>) =>
    apiClient.put<Auditorium>(`/auditoriums/${id}`, data),

  delete: (id: number) => apiClient.delete<string>(`/auditoriums/${id}`),
};

// ── Showtimes (/showtimes) ─────────────────────────────

export const showtimeApi = {
  search: (params?: {
    movieId?: number;
    cinemaId?: number;
    date?: string; // YYYY-MM-DD
  }) => {
    const query = new URLSearchParams();
    if (params?.movieId) query.set("movieId", String(params.movieId));
    if (params?.cinemaId) query.set("cinemaId", String(params.cinemaId));
    if (params?.date) query.set("date", params.date);
    const qs = query.toString();
    return apiClient.get<Showtime[]>(`/showtimes${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiClient.get<Showtime>(`/showtimes/${id}`),

  getSeats: (id: number) => apiClient.get<Showtime>(`/showtimes/${id}/seats`),

  create: (data: ShowtimeRequest) =>
    apiClient.post<Showtime>("/showtimes", data),

  update: (id: number, data: ShowtimeRequest) =>
    apiClient.put<Showtime>(`/showtimes/${id}`, data),

  delete: (id: number) => apiClient.delete<string>(`/showtimes/${id}`),
};

// ── Bookings (/bookings) ───────────────────────────────

export const bookingApi = {
  create: (data: BookingRequest) =>
    apiClient.post<Booking>("/bookings", data),

  processPayment: (id: number, paymentMethod: string) =>
    apiClient.post<Booking>(`/bookings/${id}/payment`, {
      paymentMethod,
    } as MockPaymentRequest),

  getById: (id: number) => apiClient.get<Booking>(`/bookings/${id}`),

  getMyBookings: () => apiClient.get<Booking[]>("/bookings/my-bookings"),

  getAll: () => apiClient.get<Booking[]>("/bookings"),

  cancel: (id: number) => apiClient.delete<string>(`/bookings/${id}`),
};

// ── Tickets (/tickets) ─────────────────────────────────

export const ticketApi = {
  findByCode: (code: string) =>
    apiClient.get<Ticket>(`/tickets/${encodeURIComponent(code)}`),

  checkIn: (code: string) =>
    apiClient.put<Ticket>(`/tickets/${encodeURIComponent(code)}/check-in`),
};

// ── Dashboard (/admin/dashboard) ───────────────────────

export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>("/admin/dashboard/stats"),
};
