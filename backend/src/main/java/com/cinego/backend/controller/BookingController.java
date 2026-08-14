package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.BookingRequest;
import com.cinego.backend.dto.response.BookingResponse;
import com.cinego.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Principal principal) {
        // TODO [MEMBER-2]: Extract username from principal (currently mock username if null)
        String username = (principal != null) ? principal.getName() : "customer@cinego.com";
        BookingResponse booking = bookingService.createBooking(request, username);
        return ApiResponse.success(booking, "Booking created (PENDING status)");
    }

    @PostMapping("/{id}/payment")
    public ApiResponse<BookingResponse> processPayment(
            @PathVariable Long id,
            @RequestParam String paymentMethod) {
        BookingResponse booking = bookingService.processMockPayment(id, paymentMethod);
        return ApiResponse.success(booking, "Payment processed successfully (PAID status)");
    }

    @GetMapping("/my-bookings")
    public ApiResponse<List<BookingResponse>> getMyBookings(Principal principal) {
        // TODO [MEMBER-2]: Extract username from principal
        String username = (principal != null) ? principal.getName() : "customer@cinego.com";
        List<BookingResponse> history = bookingService.getUserBookingHistory(username);
        return ApiResponse.success(history, "Booking history retrieved successfully");
    }

    @GetMapping
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        // TODO [MEMBER-2]: Restrict to ADMIN role
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ApiResponse.success(bookings, "All bookings retrieved successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ApiResponse.success("Booking cancelled successfully", "Booking cancelled successfully");
    }
}
