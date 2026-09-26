package com.cinego.backend.service;

import com.cinego.backend.dto.response.DashboardResponse;
import com.cinego.backend.model.Booking;
import com.cinego.backend.model.BookingSeat;
import com.cinego.backend.repository.BookingRepository;
import com.cinego.backend.repository.CinemaRepository;
import com.cinego.backend.repository.MovieRepository;
import com.cinego.backend.repository.TicketRepository;
import com.cinego.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    public DashboardResponse getDashboardStatistics() {
        DashboardResponse response = new DashboardResponse();

        // ── KPI Cards ──
        response.setTotalMovies(movieRepository.count());
        response.setTotalTicketsSold(ticketRepository.count());
        response.setTotalUsers(userRepository.count());
        response.setTotalRevenue(bookingRepository.sumPaidRevenue());

        // ── Revenue by Movie ──
        List<Booking> paidBookings = bookingRepository.findPaidBookingsSince(
                LocalDateTime.now().minusDays(365));
        Map<String, BigDecimal> revenueByMovie = new LinkedHashMap<>();
        for (Booking b : paidBookings) {
            String movieTitle = b.getShowtime() != null && b.getShowtime().getMovie() != null
                    ? b.getShowtime().getMovie().getTitle()
                    : "Unknown";
            revenueByMovie.merge(movieTitle, b.getTotalAmount(), BigDecimal::add);
        }
        response.setRevenueByMovie(revenueByMovie);

        // ── Weekly Revenue (last 7 days) ──
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Booking> weeklyBookings = bookingRepository.findPaidBookingsSince(sevenDaysAgo);
        Map<LocalDate, BigDecimal> dailyMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dailyMap.put(LocalDate.now().minusDays(i), BigDecimal.ZERO);
        }
        for (Booking b : weeklyBookings) {
            if (b.getCreatedAt() != null) {
                LocalDate day = b.getCreatedAt().toLocalDate();
                dailyMap.merge(day, b.getTotalAmount(), BigDecimal::add);
            }
        }
        List<DashboardResponse.RevenueByDay> weeklyRevenue = dailyMap.entrySet().stream()
                .map(e -> new DashboardResponse.RevenueByDay(
                        e.getKey().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("vi")),
                        e.getValue()))
                .collect(Collectors.toList());
        response.setWeeklyRevenue(weeklyRevenue);

        // ── Sales by Cinema ──
        Map<String, Long> cinemaSalesMap = new LinkedHashMap<>();
        List<Booking> allPaid = bookingRepository.findPaidBookingsSince(
                LocalDateTime.now().minusDays(365));
        for (Booking b : allPaid) {
            String cinemaName = "Unknown";
            if (b.getShowtime() != null
                    && b.getShowtime().getAuditorium() != null
                    && b.getShowtime().getAuditorium().getCinema() != null) {
                cinemaName = b.getShowtime().getAuditorium().getCinema().getName();
            }
            cinemaSalesMap.merge(cinemaName, 1L, Long::sum);
        }
        List<DashboardResponse.SalesByCinema> cinemaSales = cinemaSalesMap.entrySet().stream()
                .map(e -> new DashboardResponse.SalesByCinema(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        response.setCinemaSales(cinemaSales);

        // ── Recent Bookings (top 10) ──
        List<Booking> recentBookings = bookingRepository.findTop10ByOrderByCreatedAtDesc();
        List<DashboardResponse.RecentBookingDto> recentDtos = recentBookings.stream()
                .map(b -> {
                    DashboardResponse.RecentBookingDto dto = new DashboardResponse.RecentBookingDto();
                    dto.setId(b.getId());
                    dto.setBookingCode("CG-" + String.format("%07d", b.getId()));
                    dto.setMovieTitle(
                            b.getShowtime() != null && b.getShowtime().getMovie() != null
                                    ? b.getShowtime().getMovie().getTitle()
                                    : "N/A");
                    dto.setSeatNames(
                            b.getBookingSeats().stream()
                                    .map(bs -> bs.getSeat().getRowName() + bs.getSeat().getSeatNumber())
                                    .collect(Collectors.joining(", ")));
                    dto.setTotalAmount(b.getTotalAmount());
                    dto.setStatus(b.getStatus().name());
                    dto.setCreatedAt(b.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        response.setRecentBookings(recentDtos);

        return response;
    }
}
