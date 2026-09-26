package com.cinego.backend.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class DashboardResponse {

    private Long totalMovies;
    private Long totalTicketsSold;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private Map<String, BigDecimal> revenueByMovie;
    private List<RevenueByDay> weeklyRevenue;
    private List<SalesByCinema> cinemaSales;
    private List<RecentBookingDto> recentBookings;

    public DashboardResponse() {
    }

    // ── Getters / Setters ──

    public Long getTotalMovies() {
        return totalMovies;
    }

    public void setTotalMovies(Long totalMovies) {
        this.totalMovies = totalMovies;
    }

    public Long getTotalTicketsSold() {
        return totalTicketsSold;
    }

    public void setTotalTicketsSold(Long totalTicketsSold) {
        this.totalTicketsSold = totalTicketsSold;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Map<String, BigDecimal> getRevenueByMovie() {
        return revenueByMovie;
    }

    public void setRevenueByMovie(Map<String, BigDecimal> revenueByMovie) {
        this.revenueByMovie = revenueByMovie;
    }

    public List<RevenueByDay> getWeeklyRevenue() {
        return weeklyRevenue;
    }

    public void setWeeklyRevenue(List<RevenueByDay> weeklyRevenue) {
        this.weeklyRevenue = weeklyRevenue;
    }

    public List<SalesByCinema> getCinemaSales() {
        return cinemaSales;
    }

    public void setCinemaSales(List<SalesByCinema> cinemaSales) {
        this.cinemaSales = cinemaSales;
    }

    public List<RecentBookingDto> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<RecentBookingDto> recentBookings) {
        this.recentBookings = recentBookings;
    }

    // ── Inner DTOs ──

    public static class RevenueByDay {
        private String day;
        private BigDecimal revenue;

        public RevenueByDay() {
        }

        public RevenueByDay(String day, BigDecimal revenue) {
            this.day = day;
            this.revenue = revenue;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public BigDecimal getRevenue() {
            return revenue;
        }

        public void setRevenue(BigDecimal revenue) {
            this.revenue = revenue;
        }
    }

    public static class SalesByCinema {
        private String name;
        private long sales;

        public SalesByCinema() {
        }

        public SalesByCinema(String name, long sales) {
            this.name = name;
            this.sales = sales;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public long getSales() {
            return sales;
        }

        public void setSales(long sales) {
            this.sales = sales;
        }
    }

    public static class RecentBookingDto {
        private Long id;
        private String bookingCode;
        private String movieTitle;
        private String seatNames;
        private BigDecimal totalAmount;
        private String status;
        private LocalDateTime createdAt;

        public RecentBookingDto() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getBookingCode() {
            return bookingCode;
        }

        public void setBookingCode(String bookingCode) {
            this.bookingCode = bookingCode;
        }

        public String getMovieTitle() {
            return movieTitle;
        }

        public void setMovieTitle(String movieTitle) {
            this.movieTitle = movieTitle;
        }

        public String getSeatNames() {
            return seatNames;
        }

        public void setSeatNames(String seatNames) {
            this.seatNames = seatNames;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
