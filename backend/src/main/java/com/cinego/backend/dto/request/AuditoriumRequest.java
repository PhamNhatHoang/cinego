package com.cinego.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AuditoriumRequest {

    @NotBlank(message = "Auditorium name is required")
    private String name;

    @NotNull(message = "Cinema ID is required")
    private Long cinemaId;

    private Integer totalRows = 8; // e.g. A-H
    private Integer seatsPerRow = 10; // e.g. 1-10

    public AuditoriumRequest() {
    }

    public AuditoriumRequest(String name, Long cinemaId) {
        this.name = name;
        this.cinemaId = cinemaId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCinemaId() {
        return cinemaId;
    }

    public void setCinemaId(Long cinemaId) {
        this.cinemaId = cinemaId;
    }

    public Integer getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(Integer totalRows) {
        this.totalRows = totalRows;
    }

    public Integer getSeatsPerRow() {
        return seatsPerRow;
    }

    public void setSeatsPerRow(Integer seatsPerRow) {
        this.seatsPerRow = seatsPerRow;
    }
}
