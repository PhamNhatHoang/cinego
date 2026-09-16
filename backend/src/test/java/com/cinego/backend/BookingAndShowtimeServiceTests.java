package com.cinego.backend;

import com.cinego.backend.dto.request.BookingRequest;
import com.cinego.backend.dto.request.ShowtimeRequest;
import com.cinego.backend.dto.response.BookingResponse;
import com.cinego.backend.dto.response.ShowtimeResponse;
import com.cinego.backend.dto.response.TicketResponse;
import com.cinego.backend.exception.BadRequestException;
import com.cinego.backend.model.*;
import com.cinego.backend.model.enums.BookingStatus;
import com.cinego.backend.model.enums.SeatType;
import com.cinego.backend.model.enums.TicketStatus;
import com.cinego.backend.repository.*;
import com.cinego.backend.service.BookingService;
import com.cinego.backend.service.ShowtimeService;
import com.cinego.backend.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingAndShowtimeServiceTests {

    @Mock
    private ShowtimeRepository showtimeRepository;
    @Mock
    private MovieRepository movieRepository;
    @Mock
    private AuditoriumRepository auditoriumRepository;
    @Mock
    private SeatRepository seatRepository;
    @Mock
    private TicketRepository ticketRepository;
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private BookingSeatRepository bookingSeatRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShowtimeService showtimeService;

    @InjectMocks
    private BookingService bookingService;

    @InjectMocks
    private TicketService ticketService;

    private Movie sampleMovie;
    private Auditorium sampleAuditorium;
    private Showtime sampleShowtime;
    private Seat seatStandard;
    private Seat seatVip;

    @BeforeEach
    void setUp() {
        Cinema cinema = new Cinema("CineGo Hùng Vương", "126 Hồng Bàng, Q.5", "19006017");
        cinema.setId(1L);

        sampleAuditorium = new Auditorium("Phòng 1", 80, cinema);
        sampleAuditorium.setId(1L);

        sampleMovie = new Movie("Captain America", "Action movie", 120, "poster.jpg", "trailer.mp4", "T13", null);
        sampleMovie.setId(1L);

        sampleShowtime = new Showtime(
                LocalDateTime.of(2026, 7, 16, 19, 0),
                LocalDateTime.of(2026, 7, 16, 21, 15),
                BigDecimal.valueOf(80000),
                sampleMovie,
                sampleAuditorium
        );
        sampleShowtime.setId(101L);

        seatStandard = new Seat("A", 1, SeatType.STANDARD, sampleAuditorium);
        seatStandard.setId(10L);

        seatVip = new Seat("F", 5, SeatType.VIP, sampleAuditorium);
        seatVip.setId(20L);
    }

    @Test
    @DisplayName("Phát hiện xung đột lịch chiếu khi thêm suất chiếu trùng giờ trong cùng 1 phòng")
    void testShowtimeOverlapConflict() {
        ShowtimeRequest request = new ShowtimeRequest();
        request.setMovieId(1L);
        request.setAuditoriumId(1L);
        request.setStartTime(LocalDateTime.of(2026, 7, 16, 19, 30));
        request.setBasePrice(BigDecimal.valueOf(90000));

        when(movieRepository.findById(1L)).thenReturn(Optional.of(sampleMovie));
        when(auditoriumRepository.findById(1L)).thenReturn(Optional.of(sampleAuditorium));
        when(showtimeRepository.findOverlappingShowtimesForNew(eq(1L), any(), any()))
                .thenReturn(Collections.singletonList(sampleShowtime));

        assertThrows(BadRequestException.class, () -> showtimeService.createShowtime(request));
    }

    @Test
    @DisplayName("Tạo đơn đặt vé và tính toán tổng tiền chính xác theo loại ghế (Standard + VIP)")
    void testCreateBookingAndPriceCalculation() {
        BookingRequest request = new BookingRequest();
        request.setShowtimeId(101L);
        request.setSeatIds(Arrays.asList(10L, 20L));

        when(showtimeRepository.findById(101L)).thenReturn(Optional.of(sampleShowtime));
        when(ticketRepository.findBookedSeatIdsByShowtimeId(eq(101L), any())).thenReturn(Collections.emptyList());
        when(seatRepository.findByIdIn(Arrays.asList(10L, 20L))).thenReturn(Arrays.asList(seatStandard, seatVip));

        Booking mockBooking = new Booking(BigDecimal.valueOf(190000), null, sampleShowtime);
        mockBooking.setId(1L);
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);

        BookingResponse response = bookingService.createBooking(request, "anonymousUser");

        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(190000), response.getTotalAmount()); // 80k standard + 110k VIP
        assertEquals(BookingStatus.PENDING.name(), response.getStatus());
    }

    @Test
    @DisplayName("Từ chối đặt vé nếu ghế đã có người đặt thành công trước đó (Chống Double Booking)")
    void testPreventDoubleBooking() {
        BookingRequest request = new BookingRequest();
        request.setShowtimeId(101L);
        request.setSeatIds(Collections.singletonList(10L));

        when(showtimeRepository.findById(101L)).thenReturn(Optional.of(sampleShowtime));
        when(ticketRepository.findBookedSeatIdsByShowtimeId(eq(101L), any()))
                .thenReturn(Collections.singletonList(10L)); // Ghế 10L đã có vé

        assertThrows(BadRequestException.class, () -> bookingService.createBooking(request, "anonymousUser"));
    }

    @Test
    @DisplayName("Thanh toán mô phỏng thành công chuyển trạng thái sang PAID và sinh Ticket")
    void testProcessMockPayment() {
        Booking booking = new Booking(BigDecimal.valueOf(80000), null, sampleShowtime);
        booking.setId(99L);
        booking.setStatus(BookingStatus.PENDING);
        BookingSeat bs = new BookingSeat(BigDecimal.valueOf(80000), booking, seatStandard);
        booking.setBookingSeats(Collections.singletonList(bs));

        when(bookingRepository.findById(99L)).thenReturn(Optional.of(booking));
        when(ticketRepository.findBookedSeatIdsByShowtimeId(eq(101L), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.processMockPayment(99L, "MOMO");

        assertEquals(BookingStatus.PAID.name(), response.getStatus());
        assertFalse(response.getTickets().isEmpty());
        assertTrue(response.getTickets().get(0).getTicketCode().startsWith("CG-"));
    }

    @Test
    @DisplayName("Soát vé (Check-in) thành công và chặn không cho check-in lần 2")
    void testTicketCheckInFlow() {
        Ticket ticket = new Ticket("CG-ABC1234", null, seatStandard, sampleShowtime);
        ticket.setId(555L);
        ticket.setStatus(TicketStatus.ACTIVE);

        when(ticketRepository.findByTicketCodeIgnoreCase("CG-ABC1234")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Lần 1: Check-in thành công
        TicketResponse response = ticketService.checkInTicket("CG-ABC1234");
        assertEquals(TicketStatus.CHECKED_IN.name(), response.getStatus());
        assertNotNull(response.getCheckedInAt());

        // Lần 2: Check-in lại bị từ chối
        ticket.setStatus(TicketStatus.CHECKED_IN);
        assertThrows(BadRequestException.class, () -> ticketService.checkInTicket("CG-ABC1234"));
    }
}
