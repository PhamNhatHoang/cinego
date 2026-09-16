package com.cinego.backend.repository;

import com.cinego.backend.model.Ticket;
import com.cinego.backend.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCodeIgnoreCase(String ticketCode);

    List<Ticket> findByBookingId(Long bookingId);

    List<Ticket> findByShowtimeId(Long showtimeId);

    boolean existsByShowtimeIdAndSeatId(Long showtimeId, Long seatId);

    @Query("SELECT t.seat.id FROM Ticket t WHERE t.showtime.id = :showtimeId AND t.status IN (:activeStatuses)")
    List<Long> findBookedSeatIdsByShowtimeId(
        @Param("showtimeId") Long showtimeId,
        @Param("activeStatuses") List<TicketStatus> activeStatuses
    );
}
