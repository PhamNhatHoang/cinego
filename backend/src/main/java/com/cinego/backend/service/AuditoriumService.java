package com.cinego.backend.service;

import com.cinego.backend.dto.request.AuditoriumRequest;
import com.cinego.backend.dto.response.AuditoriumResponse;
import com.cinego.backend.dto.response.SeatResponse;
import com.cinego.backend.exception.ResourceNotFoundException;
import com.cinego.backend.model.Auditorium;
import com.cinego.backend.model.Cinema;
import com.cinego.backend.model.Seat;
import com.cinego.backend.model.enums.SeatType;
import com.cinego.backend.repository.AuditoriumRepository;
import com.cinego.backend.repository.CinemaRepository;
import com.cinego.backend.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditoriumService {

    private final AuditoriumRepository auditoriumRepository;
    private final CinemaRepository cinemaRepository;
    private final SeatRepository seatRepository;

    public AuditoriumService(
            AuditoriumRepository auditoriumRepository,
            CinemaRepository cinemaRepository,
            SeatRepository seatRepository
    ) {
        this.auditoriumRepository = auditoriumRepository;
        this.cinemaRepository = cinemaRepository;
        this.seatRepository = seatRepository;
    }

    public List<AuditoriumResponse> getAllAuditoriums() {
        return auditoriumRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AuditoriumResponse> getAuditoriumsByCinema(Long cinemaId) {
        return auditoriumRepository.findByCinemaId(cinemaId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AuditoriumResponse getAuditoriumById(Long id) {
        Auditorium auditorium = auditoriumRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auditorium not found with id: " + id));
        AuditoriumResponse response = mapToResponse(auditorium);
        List<SeatResponse> seatResponses = seatRepository.findByAuditoriumIdOrderByRowNameAscSeatNumberAsc(id).stream()
                .map(s -> new SeatResponse(s.getId(), s.getRowName(), s.getSeatNumber(), s.getType(), false))
                .collect(Collectors.toList());
        response.setSeats(seatResponses);
        return response;
    }

    @Transactional
    public AuditoriumResponse createAuditorium(AuditoriumRequest request) {
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + request.getCinemaId()));

        int rowCount = request.getTotalRows() != null && request.getTotalRows() > 0 ? request.getTotalRows() : 8;
        int seatsPerRow = request.getSeatsPerRow() != null && request.getSeatsPerRow() > 0 ? request.getSeatsPerRow() : 10;
        int totalSeats = rowCount * seatsPerRow;

        Auditorium auditorium = new Auditorium(request.getName(), totalSeats, cinema);
        Auditorium saved = auditoriumRepository.save(auditorium);

        generateSeatGrid(saved, rowCount, seatsPerRow);

        return getAuditoriumById(saved.getId());
    }

    @Transactional
    public void generateSeatGrid(Auditorium auditorium, int rowCount, int seatsPerRow) {
        List<Seat> seats = new ArrayList<>();
        char startRow = 'A';

        for (int r = 0; r < rowCount; r++) {
            String rowName = String.valueOf((char) (startRow + r));
            for (int col = 1; col <= seatsPerRow; col++) {
                SeatType type = SeatType.STANDARD;
                // Rows E, F, G are VIP
                if (rowName.equals("E") || rowName.equals("F") || rowName.equals("G")) {
                    type = SeatType.VIP;
                } else if (r == rowCount - 1) { // Last row is Couple
                    type = SeatType.COUPLE;
                }
                seats.add(new Seat(rowName, col, type, auditorium));
            }
        }
        seatRepository.saveAll(seats);
    }

    @Transactional
    public void deleteAuditorium(Long id) {
        if (!auditoriumRepository.existsById(id)) {
            throw new ResourceNotFoundException("Auditorium not found with id: " + id);
        }
        auditoriumRepository.deleteById(id);
    }

    public List<SeatResponse> getSeatsByAuditorium(Long auditoriumId) {
        return seatRepository.findByAuditoriumIdOrderByRowNameAscSeatNumberAsc(auditoriumId).stream()
                .map(s -> new SeatResponse(s.getId(), s.getRowName(), s.getSeatNumber(), s.getType(), false))
                .collect(Collectors.toList());
    }

    private AuditoriumResponse mapToResponse(Auditorium auditorium) {
        return new AuditoriumResponse(
                auditorium.getId(),
                auditorium.getName(),
                auditorium.getTotalSeats(),
                auditorium.getStatus(),
                auditorium.getCinema() != null ? auditorium.getCinema().getId() : null,
                auditorium.getCinema() != null ? auditorium.getCinema().getName() : null
        );
    }
}
