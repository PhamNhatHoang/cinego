package com.cinego.backend.dto.response;

import com.cinego.backend.model.enums.SeatType;

public class SeatResponse {

    private Long id;
    private String rowName;
    private Integer seatNumber;
    private String seatCode; // e.g. "A1", "F5"
    private SeatType type;
    private boolean isOccupied;

    public SeatResponse() {
    }

    public SeatResponse(Long id, String rowName, Integer seatNumber, SeatType type, boolean isOccupied) {
        this.id = id;
        this.rowName = rowName;
        this.seatNumber = seatNumber;
        this.seatCode = rowName + seatNumber;
        this.type = type;
        this.isOccupied = isOccupied;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRowName() {
        return rowName;
    }

    public void setRowName(String rowName) {
        this.rowName = rowName;
        this.seatCode = (rowName != null ? rowName : "") + (seatNumber != null ? seatNumber : "");
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
        this.seatCode = (rowName != null ? rowName : "") + (seatNumber != null ? seatNumber : "");
    }

    public String getSeatCode() {
        return seatCode;
    }

    public void setSeatCode(String seatCode) {
        this.seatCode = seatCode;
    }

    public SeatType getType() {
        return type;
    }

    public void setType(SeatType type) {
        this.type = type;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }
}
