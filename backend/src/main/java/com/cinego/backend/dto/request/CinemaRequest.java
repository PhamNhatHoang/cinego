package com.cinego.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CinemaRequest {

    @NotBlank(message = "Cinema name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String hotline;

    public CinemaRequest() {
    }

    public CinemaRequest(String name, String address, String hotline) {
        this.name = name;
        this.address = address;
        this.hotline = hotline;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHotline() {
        return hotline;
    }

    public void setHotline(String hotline) {
        this.hotline = hotline;
    }
}
