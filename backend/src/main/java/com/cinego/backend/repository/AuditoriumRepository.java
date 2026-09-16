package com.cinego.backend.repository;

import com.cinego.backend.model.Auditorium;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditoriumRepository extends JpaRepository<Auditorium, Long> {
    List<Auditorium> findByCinemaId(Long cinemaId);
}
