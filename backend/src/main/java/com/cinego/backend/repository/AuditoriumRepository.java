package com.cinego.backend.repository;

import com.cinego.backend.model.Auditorium;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriumRepository extends JpaRepository<Auditorium, Long> {
    // TODO [MEMBER-2]: Add findByCinemaId if needed
}
