package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.response.TicketResponse;
import com.cinego.backend.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
@Tag(name = "Tickets", description = "API tra cứu vé điện tử và soát vé")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/{ticketCode}")
    @Operation(summary = "Tra cứu thông tin vé điện tử theo mã vé")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketByCode(@PathVariable String ticketCode) {
        TicketResponse ticket = ticketService.getTicketByCode(ticketCode);
        return ResponseEntity.ok(ApiResponse.success(ticket));
    }

    @PutMapping("/{ticketCode}/check-in")
    @Operation(summary = "Soát vé & Check-in (Dành cho nhân viên rạp Staff/Admin)")
    public ResponseEntity<ApiResponse<TicketResponse>> checkInTicket(@PathVariable String ticketCode) {
        TicketResponse ticket = ticketService.checkInTicket(ticketCode);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Soát vé (Check-in) thành công!"));
    }
}
