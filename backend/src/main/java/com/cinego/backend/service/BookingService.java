package com.cinego.backend.service;

import com.cinego.backend.dto.request.BookingRequest;
import com.cinego.backend.dto.response.BookingResponse;
import com.cinego.backend.dto.response.TicketResponse;
import com.cinego.backend.exception.BadRequestException;
import com.cinego.backend.exception.ResourceNotFoundException;
import com.cinego.backend.model.*;
import com.cinego.backend.model.enums.BookingStatus;
import com.cinego.backend.model.enums.SeatType;
import com.cinego.backend.model.enums.TicketStatus;
import com.cinego.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String username) {
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + request.getShowtimeId()));

        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new BadRequestException("Vui lòng chọn ít nhất 1 ghế để đặt vé.");
        }

        // Check if any selected seat is already booked/occupied for this showtime
        List<Long> occupiedSeatIds = ticketRepository.findBookedSeatIdsByShowtimeId(
                showtime.getId(),
                Arrays.asList(TicketStatus.ACTIVE, TicketStatus.CHECKED_IN)
        );

        for (Long seatId : request.getSeatIds()) {
            if (occupiedSeatIds.contains(seatId)) {
                throw new BadRequestException("Ghế bạn chọn (ID: " + seatId + ") đã có người khác đặt thành công.");
            }
        }

        List<Seat> seats = seatRepository.findByIdIn(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Một hoặc nhiều ghế được chọn không tồn tại trong hệ thống.");
        }

        // Calculate total amount based on base price and seat surcharges
        BigDecimal basePrice = showtime.getBasePrice() != null ? showtime.getBasePrice() : BigDecimal.valueOf(80000);
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<BookingSeat> bookingSeatsToSave = new ArrayList<>();

        User user = null;
        if (username != null && !username.trim().isEmpty() && !username.equals("anonymousUser")) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        Booking booking = new Booking(BigDecimal.ZERO, user, showtime);
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        Booking savedBooking = bookingRepository.save(booking);

        for (Seat seat : seats) {
            BigDecimal seatPrice = basePrice;
            if (seat.getType() == SeatType.VIP) {
                seatPrice = seatPrice.add(BigDecimal.valueOf(30000));
            } else if (seat.getType() == SeatType.COUPLE) {
                seatPrice = seatPrice.add(BigDecimal.valueOf(40000));
            }
            totalAmount = totalAmount.add(seatPrice);
            bookingSeatsToSave.add(new BookingSeat(seatPrice, savedBooking, seat));
        }

        savedBooking.setTotalAmount(totalAmount);
        savedBooking.setBookingSeats(bookingSeatsToSave);
        bookingSeatRepository.saveAll(bookingSeatsToSave);
        savedBooking = bookingRepository.save(savedBooking);

        return mapToBookingResponse(savedBooking);
    }

    @Transactional
    public BookingResponse processMockPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.PAID) {
            return mapToBookingResponse(booking);
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Đơn đặt vé này không ở trạng thái chờ thanh toán (Trạng thái hiện tại: " + booking.getStatus() + ").");
        }

        // Check if any seat was booked by another concurrent transaction in the meantime
        List<Long> requestedSeatIds = booking.getBookingSeats().stream()
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toList());

        List<Long> alreadyBooked = ticketRepository.findBookedSeatIdsByShowtimeId(
                booking.getShowtime().getId(),
                Arrays.asList(TicketStatus.ACTIVE, TicketStatus.CHECKED_IN)
        );

        for (Long seatId : requestedSeatIds) {
            if (alreadyBooked.contains(seatId)) {
                booking.setStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
                throw new BadRequestException("Rất tiếc! Một trong các ghế đã bị đặt bởi khách hàng khác. Giao dịch bị hủy.");
            }
        }

        // Create Ticket entries for each booked seat with unique ticketCode
        List<Ticket> generatedTickets = new ArrayList<>();
        for (BookingSeat bs : booking.getBookingSeats()) {
            String ticketCode = generateUniqueTicketCode();
            Ticket ticket = new Ticket(ticketCode, booking, bs.getSeat(), booking.getShowtime());
            ticket.setStatus(TicketStatus.ACTIVE);
            generatedTickets.add(ticket);
        }

        ticketRepository.saveAll(generatedTickets);
        booking.setStatus(BookingStatus.PAID);
        booking.setTickets(generatedTickets);
        Booking updated = bookingRepository.save(booking);

        return mapToBookingResponse(updated);
    }

    public List<BookingResponse> getUserBookingHistory(String username) {
        return bookingRepository.findByUsernameOrderByCreatedAtDesc(username).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToBookingResponse(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        booking.setStatus(BookingStatus.CANCELLED);
        if (booking.getTickets() != null) {
            for (Ticket t : booking.getTickets()) {
                t.setStatus(TicketStatus.EXPIRED);
            }
            ticketRepository.saveAll(booking.getTickets());
        }
        bookingRepository.save(booking);
    }

    private String generateUniqueTicketCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder("CG-");
        Random random = new Random();
        for (int i = 0; i < 7; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public BookingResponse mapToBookingResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingCode("CG-" + String.format("%07d", booking.getId()));
        response.setStatus(booking.getStatus().name());
        response.setTotalAmount(booking.getTotalAmount());
        response.setCreatedAt(booking.getCreatedAt());
        response.setExpiresAt(booking.getExpiresAt());

        if (booking.getUser() != null) {
            response.setCustomerName(booking.getUser().getFullName());
            response.setCustomerEmail(booking.getUser().getEmail());
            response.setCustomerPhone(booking.getUser().getPhoneNumber());
        } else {
            response.setCustomerName("Khách vãng lai");
            response.setCustomerEmail("customer@cinego.com");
            response.setCustomerPhone("0901234567");
        }

        if (booking.getShowtime() != null) {
            Showtime s = booking.getShowtime();
            response.setShowtimeId(s.getId());
            response.setStartTime(s.getStartTime());
            response.setEndTime(s.getEndTime());

            if (s.getMovie() != null) {
                response.setMovieTitle(s.getMovie().getTitle());
                response.setMoviePosterUrl(s.getMovie().getPosterUrl());
            }

            if (s.getAuditorium() != null) {
                response.setAuditoriumName(s.getAuditorium().getName());
                if (s.getAuditorium().getCinema() != null) {
                    response.setCinemaName(s.getAuditorium().getCinema().getName());
                    response.setCinemaAddress(s.getAuditorium().getCinema().getAddress());
                }
            }
        }

        if (booking.getBookingSeats() != null) {
            List<String> seatNames = booking.getBookingSeats().stream()
                    .map(bs -> bs.getSeat().getRowName() + bs.getSeat().getSeatNumber())
                    .collect(Collectors.toList());
            List<Long> seatIds = booking.getBookingSeats().stream()
                    .map(bs -> bs.getSeat().getId())
                    .collect(Collectors.toList());
            response.setSeatNames(seatNames);
            response.setSeatIds(seatIds);
        }

        if (booking.getTickets() != null && !booking.getTickets().isEmpty()) {
            List<TicketResponse> ticketResponses = booking.getTickets().stream()
                    .map(t -> {
                        TicketResponse tr = new TicketResponse();
                        tr.setId(t.getId());
                        tr.setTicketCode(t.getTicketCode());
                        tr.setBookingId(booking.getId());
                        tr.setBookingCode(response.getBookingCode());
                        tr.setStatus(t.getStatus().name());
                        tr.setCheckedInAt(t.getCheckedInAt());
                        tr.setCustomerName(response.getCustomerName());
                        tr.setCustomerEmail(response.getCustomerEmail());
                        tr.setCustomerPhone(response.getCustomerPhone());
                        tr.setQrCodeData(t.getTicketCode());

                        if (booking.getShowtime() != null) {
                            tr.setStartTime(booking.getShowtime().getStartTime());
                            tr.setEndTime(booking.getShowtime().getEndTime());
                            if (booking.getShowtime().getMovie() != null) {
                                tr.setMovieTitle(booking.getShowtime().getMovie().getTitle());
                                tr.setMoviePosterUrl(booking.getShowtime().getMovie().getPosterUrl());
                                tr.setMovieDuration(booking.getShowtime().getMovie().getDuration());
                                tr.setMovieAgeRating(booking.getShowtime().getMovie().getRated());
                            }
                            if (booking.getShowtime().getAuditorium() != null) {
                                tr.setAuditoriumName(booking.getShowtime().getAuditorium().getName());
                                if (booking.getShowtime().getAuditorium().getCinema() != null) {
                                    tr.setCinemaName(booking.getShowtime().getAuditorium().getCinema().getName());
                                    tr.setCinemaAddress(booking.getShowtime().getAuditorium().getCinema().getAddress());
                                }
                            }
                        }

                        if (t.getSeat() != null) {
                            tr.setSeatId(t.getSeat().getId());
                            tr.setSeatName(t.getSeat().getRowName() + t.getSeat().getSeatNumber());
                            tr.setSeatType(t.getSeat().getType().name());
                        }

                        return tr;
                    })
                    .collect(Collectors.toList());
            response.setTickets(ticketResponses);
        }

        return response;
    }
}
