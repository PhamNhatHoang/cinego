package com.cinego.backend.dto.response;

import java.util.List;

public class AuditoriumResponse {

    private Long id;
    private String name;
    private Integer totalSeats;
    private String status;
    private Long cinemaId;
    private String cinemaName;
    private List<SeatResponse> seats;

    public AuditoriumResponse() {
    }

    public AuditoriumResponse(Long id, String name, Integer totalSeats, String status, Long cinemaId, String cinemaName) {
        this.id = id;
        this.name = name;
        this.totalSeats = totalSeats;
        this.status = status;
        this.cinemaId = cinemaId;
        this.cinemaName = cinemaName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public String getCinemaName() {
        return cinemaName;
    }

    public void setCinemaName(String cinemaName) {
        this.cinemaName = cinemaName;
    }

    public List<SeatResponse> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatResponse> seats) {
        this.seats = seats;
    }
}
