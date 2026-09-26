package com.cinego.backend.repository;

import com.cinego.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.user.username = :username ORDER BY b.createdAt DESC")
    List<Booking> findByUsernameOrderByCreatedAtDesc(@Param("username") String username);

    List<Booking> findByShowtimeId(Long showtimeId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    // ── Dashboard queries ──

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'PAID'")
    BigDecimal sumPaidRevenue();

    List<Booking> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT b FROM Booking b WHERE b.status = 'PAID' AND b.createdAt >= :since ORDER BY b.createdAt ASC")
    List<Booking> findPaidBookingsSince(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'PAID'")
    long countPaidBookings();
}
