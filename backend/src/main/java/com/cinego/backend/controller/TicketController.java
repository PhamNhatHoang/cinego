package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.response.TicketResponse;
import com.cinego.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping("/{ticketCode}")
    public ApiResponse<TicketResponse> getTicketByCode(@PathVariable String ticketCode) {
        TicketResponse ticket = ticketService.getTicketByCode(ticketCode);
        return ApiResponse.success(ticket, "Ticket details retrieved successfully");
    }

    @PutMapping("/{ticketCode}/check-in")
    public ApiResponse<TicketResponse> checkInTicket(@PathVariable String ticketCode) {
        // TODO [MEMBER-2]: Restrict to STAFF / ADMIN roles
        TicketResponse ticket = ticketService.checkInTicket(ticketCode);
        return ApiResponse.success(ticket, "Ticket checked in successfully");
    }
}
