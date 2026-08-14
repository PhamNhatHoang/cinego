package com.cinego.backend.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardResponse {

    private Long totalMovies;
    private Long totalTicketsSold;
    private Long totalUsers;
    private BigDecimal totalRevenue;
    private Map<String, BigDecimal> revenueByMovie;

    // TODO [MEMBER-2]: Add more stats: weekly/monthly trends, active showtimes, booking statistics

    public DashboardResponse() {
    }

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
}
