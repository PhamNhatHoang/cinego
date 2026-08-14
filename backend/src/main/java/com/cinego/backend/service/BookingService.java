package com.cinego.backend.service;

import com.cinego.backend.dto.request.BookingRequest;
import com.cinego.backend.dto.response.BookingResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    // TODO [MEMBER-2]: Inject BookingRepository, BookingSeatRepository, ShowtimeRepository, SeatRepository, TicketRepository, UserRepository

    public BookingResponse createBooking(BookingRequest request, String username) {
        // TODO [MEMBER-2]: Load Showtime, User, and selected Seats
        // TODO [SHARED]: Check if any selected seat is already booked/occupied for this showtime
        // TODO [MEMBER-2]: Calculate total amount based on base price and seat types
        // TODO [MEMBER-2]: Save Booking (state PENDING), save BookingSeats, and return response
        return null;
    }

    public BookingResponse processMockPayment(Long bookingId, String paymentMethod) {
        // TODO [MEMBER-2]: Validate PENDING booking. Update status to PAID
        // TODO [MEMBER-2]: Create Ticket entries for each booked seat with unique ticketCode
        // TODO [MEMBER-2]: Save and return updated BookingResponse
        return null;
    }

    public List<BookingResponse> getUserBookingHistory(String username) {
        // TODO [MEMBER-2]: Retrieve bookings for a specific user
        return null;
    }

    public List<BookingResponse> getAllBookings() {
        // TODO [MEMBER-2]: Retrieve all bookings (Admin dashboard)
        return null;
    }

    public void cancelBooking(Long bookingId) {
        // TODO [MEMBER-2]: Cancel a PENDING or PAID booking, release seats/tickets
    }
}
