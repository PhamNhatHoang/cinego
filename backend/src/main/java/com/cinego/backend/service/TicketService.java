package com.cinego.backend.service;

import com.cinego.backend.dto.response.TicketResponse;
import com.cinego.backend.exception.BadRequestException;
import com.cinego.backend.exception.ResourceNotFoundException;
import com.cinego.backend.model.Ticket;
import com.cinego.backend.model.enums.TicketStatus;
import com.cinego.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public TicketResponse getTicketByCode(String ticketCode) {
        if (ticketCode == null || ticketCode.trim().isEmpty()) {
            throw new BadRequestException("Mã vé không được để trống.");
        }

        Ticket ticket = ticketRepository.findByTicketCodeIgnoreCase(ticketCode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin vé với mã: " + ticketCode));

        return mapToTicketResponse(ticket);
    }

    @Transactional
    public TicketResponse checkInTicket(String ticketCode) {
        if (ticketCode == null || ticketCode.trim().isEmpty()) {
            throw new BadRequestException("Mã vé không được để trống.");
        }

        Ticket ticket = ticketRepository.findByTicketCodeIgnoreCase(ticketCode.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin vé với mã: " + ticketCode));

        if (ticket.getStatus() == TicketStatus.CHECKED_IN) {
            throw new BadRequestException("Vé này đã được soát (Check-in) trước đó vào lúc " + ticket.getCheckedInAt() + ".");
        }

        if (ticket.getStatus() != TicketStatus.ACTIVE) {
            throw new BadRequestException("Vé này không hợp lệ hoặc đã hết hạn (Trạng thái: " + ticket.getStatus() + ").");
        }

        ticket.setStatus(TicketStatus.CHECKED_IN);
        ticket.setCheckedInAt(LocalDateTime.now());
        Ticket updated = ticketRepository.save(ticket);

        return mapToTicketResponse(updated);
    }

    public TicketResponse mapToTicketResponse(Ticket t) {
        TicketResponse tr = new TicketResponse();
        tr.setId(t.getId());
        tr.setTicketCode(t.getTicketCode());
        tr.setStatus(t.getStatus().name());
        tr.setCheckedInAt(t.getCheckedInAt());
        tr.setQrCodeData(t.getTicketCode());

        if (t.getBooking() != null) {
            tr.setBookingId(t.getBooking().getId());
            tr.setBookingCode("CG-" + String.format("%07d", t.getBooking().getId()));
            if (t.getBooking().getUser() != null) {
                tr.setCustomerName(t.getBooking().getUser().getFullName());
                tr.setCustomerEmail(t.getBooking().getUser().getEmail());
                tr.setCustomerPhone(t.getBooking().getUser().getPhoneNumber());
            } else {
                tr.setCustomerName("Khách hàng");
                tr.setCustomerEmail("customer@cinego.com");
                tr.setCustomerPhone("0901234567");
            }
        }

        if (t.getShowtime() != null) {
            tr.setStartTime(t.getShowtime().getStartTime());
            tr.setEndTime(t.getShowtime().getEndTime());
            if (t.getShowtime().getMovie() != null) {
                tr.setMovieTitle(t.getShowtime().getMovie().getTitle());
                tr.setMoviePosterUrl(t.getShowtime().getMovie().getPosterUrl());
                tr.setMovieDuration(t.getShowtime().getMovie().getDuration());
                tr.setMovieAgeRating(t.getShowtime().getMovie().getRated());
            }
            if (t.getShowtime().getAuditorium() != null) {
                tr.setAuditoriumName(t.getShowtime().getAuditorium().getName());
                if (t.getShowtime().getAuditorium().getCinema() != null) {
                    tr.setCinemaName(t.getShowtime().getAuditorium().getCinema().getName());
                    tr.setCinemaAddress(t.getShowtime().getAuditorium().getCinema().getAddress());
                }
            }
        }

        if (t.getSeat() != null) {
            tr.setSeatId(t.getSeat().getId());
            tr.setSeatName(t.getSeat().getRowName() + t.getSeat().getSeatNumber());
            tr.setSeatType(t.getSeat().getType().name());
        }

        return tr;
    }
}
