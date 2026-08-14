package com.cinego.backend.repository;

import com.cinego.backend.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    // TODO [MEMBER-1]: Add findByName(RoleName name)
}
