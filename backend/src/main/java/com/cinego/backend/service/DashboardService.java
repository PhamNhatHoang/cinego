package com.cinego.backend.service;

import com.cinego.backend.dto.response.DashboardResponse;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    // TODO [MEMBER-2]: Inject MovieRepository, TicketRepository, UserRepository, BookingRepository

    public DashboardResponse getDashboardStatistics() {
        // TODO [MEMBER-2]: Calculate total movies, tickets sold, registered users, and total revenue
        // TODO [MEMBER-2]: Aggregate revenue by movie and populate DashboardResponse
        return null;
    }
}
