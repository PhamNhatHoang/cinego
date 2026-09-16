package com.cinego.backend.repository;

import com.cinego.backend.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT s FROM Showtime s WHERE s.auditorium.id = :auditoriumId " +
           "AND s.id <> :excludeId " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    List<Showtime> findOverlappingShowtimes(
        @Param("auditoriumId") Long auditoriumId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeId") Long excludeId
    );

    @Query("SELECT s FROM Showtime s WHERE s.auditorium.id = :auditoriumId " +
           "AND s.startTime < :endTime AND s.endTime > :startTime")
    List<Showtime> findOverlappingShowtimesForNew(
        @Param("auditoriumId") Long auditoriumId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT s FROM Showtime s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.auditorium a " +
           "JOIN FETCH a.cinema c " +
           "WHERE (:movieId IS NULL OR m.id = :movieId) " +
           "AND (:cinemaId IS NULL OR c.id = :cinemaId) " +
           "AND s.startTime BETWEEN :startOfDay AND :endOfDay " +
           "ORDER BY s.startTime ASC")
    List<Showtime> findShowtimesFiltered(
        @Param("movieId") Long movieId,
        @Param("cinemaId") Long cinemaId,
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );

    List<Showtime> findByMovieId(Long movieId);
    List<Showtime> findByAuditoriumCinemaId(Long cinemaId);
    List<Showtime> findByAuditoriumId(Long auditoriumId);
}
