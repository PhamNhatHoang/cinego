package com.cinego.backend.repository;

import com.cinego.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    // TODO [MEMBER-2]: Add findByAuditoriumId if needed
}
