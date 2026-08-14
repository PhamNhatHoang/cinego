package com.cinego.backend.repository;

import com.cinego.backend.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    // TODO [MEMBER-1]: Add search/filter queries (by title, status, genre)
}
