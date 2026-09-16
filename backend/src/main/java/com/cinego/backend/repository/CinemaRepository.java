package com.cinego.backend.repository;

import com.cinego.backend.model.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    List<Cinema> findByNameContainingIgnoreCaseOrAddressContainingIgnoreCase(String name, String address);
}
