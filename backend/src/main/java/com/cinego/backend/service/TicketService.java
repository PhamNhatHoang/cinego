package com.cinego.backend.service;

import com.cinego.backend.dto.response.TicketResponse;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    // TODO [MEMBER-2]: Inject TicketRepository

    public TicketResponse getTicketByCode(String ticketCode) {
        // TODO [MEMBER-2]: Retrieve ticket details by unique code for verification
        return null;
    }

    public TicketResponse checkInTicket(String ticketCode) {
        // TODO [MEMBER-2]: Verify ticket is ACTIVE (not checked-in yet, showtime is valid)
        // TODO [MEMBER-2]: Update status to CHECKED_IN and save checkedInAt timestamp
        return null;
    }
}
