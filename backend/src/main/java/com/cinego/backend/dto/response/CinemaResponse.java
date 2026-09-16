package com.cinego.backend.dto.response;

public class CinemaResponse {

    private Long id;
    private String name;
    private String address;
    private String hotline;
    private int totalAuditoriums;

    public CinemaResponse() {
    }

    public CinemaResponse(Long id, String name, String address, String hotline, int totalAuditoriums) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.hotline = hotline;
        this.totalAuditoriums = totalAuditoriums;
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

    public int getTotalAuditoriums() {
        return totalAuditoriums;
    }

    public void setTotalAuditoriums(int totalAuditoriums) {
        this.totalAuditoriums = totalAuditoriums;
    }
}
