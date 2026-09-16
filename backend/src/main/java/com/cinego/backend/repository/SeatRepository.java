package com.cinego.backend.repository;

import com.cinego.backend.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByAuditoriumIdOrderByRowNameAscSeatNumberAsc(Long auditoriumId);
    List<Seat> findByIdIn(List<Long> seatIds);
}
