package com.cinego.backend.repository;

import com.cinego.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // TODO [MEMBER-1]: Add findByUsername, findByEmail, existsByUsername, existsByEmail
}
