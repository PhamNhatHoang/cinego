package com.cinego.backend.repository;

import com.cinego.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    // TODO [MEMBER-2]: Add findByTicketCode
}
