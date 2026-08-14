package com.cinego.backend.repository;

import com.cinego.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // TODO [MEMBER-2]: Add findByUserId, findByShowtimeId if needed
}
