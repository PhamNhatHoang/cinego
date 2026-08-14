package com.cinego.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "auditoriums")
public class Auditorium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "total_seats")
    private Integer totalSeats;

    // TODO [MEMBER-2]: Add ManyToOne relationship to Cinema
    // TODO [MEMBER-2]: Add OneToMany relationship to Seat
    // TODO [MEMBER-2]: Add status field (ACTIVE, MAINTENANCE) if needed

    public Auditorium() {
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
}
