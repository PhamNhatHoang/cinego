package com.cinego.backend.repository;

import com.cinego.backend.model.Role;
import com.cinego.backend.model.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
