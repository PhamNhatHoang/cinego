package com.cinego.backend.repository;

import com.cinego.backend.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    // TODO [MEMBER-2]: Add queries for showtime listing (by movie, by auditorium, by date)
}
