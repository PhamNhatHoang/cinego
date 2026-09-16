package com.cinego.backend.repository;

import com.cinego.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.user.username = :username ORDER BY b.createdAt DESC")
    List<Booking> findByUsernameOrderByCreatedAtDesc(@Param("username") String username);

    List<Booking> findByShowtimeId(Long showtimeId);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
