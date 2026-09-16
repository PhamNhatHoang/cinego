package com.cinego.backend.service;

import com.cinego.backend.dto.request.ShowtimeRequest;
import com.cinego.backend.dto.response.SeatResponse;
import com.cinego.backend.dto.response.ShowtimeResponse;
import com.cinego.backend.exception.BadRequestException;
import com.cinego.backend.exception.ResourceNotFoundException;
import com.cinego.backend.model.Auditorium;
import com.cinego.backend.model.Movie;
import com.cinego.backend.model.Seat;
import com.cinego.backend.model.Showtime;
import com.cinego.backend.model.enums.TicketStatus;
import com.cinego.backend.repository.AuditoriumRepository;
import com.cinego.backend.repository.MovieRepository;
import com.cinego.backend.repository.SeatRepository;
import com.cinego.backend.repository.ShowtimeRepository;
import com.cinego.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final AuditoriumRepository auditoriumRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    public ShowtimeService(
            ShowtimeRepository showtimeRepository,
            MovieRepository movieRepository,
            AuditoriumRepository auditoriumRepository,
            SeatRepository seatRepository,
            TicketRepository ticketRepository
    ) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.auditoriumRepository = auditoriumRepository;
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
    }

    public List<ShowtimeResponse> getShowtimes(Long movieId, Long cinemaId, LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        LocalDateTime startOfDay = queryDate.atStartOfDay();
        LocalDateTime endOfDay = queryDate.atTime(LocalTime.MAX);

        List<Showtime> showtimes = showtimeRepository.findShowtimesFiltered(movieId, cinemaId, startOfDay, endOfDay);
        return showtimes.stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    public ShowtimeResponse getShowtimeById(Long id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
        return mapToDetailResponse(showtime);
    }

    @Transactional
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        Auditorium auditorium = auditoriumRepository.findById(request.getAuditoriumId())
                .orElseThrow(() -> new ResourceNotFoundException("Auditorium not found with id: " + request.getAuditoriumId()));

        // Calculate end time: duration in minutes + 15 mins buffer
        int durationMinutes = movie.getDuration() != null ? movie.getDuration() : 120;
        LocalDateTime endTime = request.getStartTime().plusMinutes(durationMinutes + 15);

        // Check for time overlap in target auditorium
        List<Showtime> overlapping = showtimeRepository.findOverlappingShowtimesForNew(
                auditorium.getId(),
                request.getStartTime(),
                endTime
        );

        if (!overlapping.isEmpty()) {
            Showtime conflict = overlapping.get(0);
            throw new BadRequestException("Lịch chiếu bị trùng với suất chiếu đã tồn tại (" 
                    + conflict.getStartTime() + " -> " + conflict.getEndTime() + ") trong phòng " + auditorium.getName());
        }

        Showtime showtime = new Showtime(
                request.getStartTime(),
                endTime,
                request.getBasePrice(),
                movie,
                auditorium
        );

        Showtime saved = showtimeRepository.save(showtime);
        return mapToDetailResponse(saved);
    }

    @Transactional
    public ShowtimeResponse updateShowtime(Long id, ShowtimeRequest request) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        Auditorium auditorium = auditoriumRepository.findById(request.getAuditoriumId())
                .orElseThrow(() -> new ResourceNotFoundException("Auditorium not found with id: " + request.getAuditoriumId()));

        int durationMinutes = movie.getDuration() != null ? movie.getDuration() : 120;
        LocalDateTime endTime = request.getStartTime().plusMinutes(durationMinutes + 15);

        List<Showtime> overlapping = showtimeRepository.findOverlappingShowtimes(
                auditorium.getId(),
                request.getStartTime(),
                endTime,
                id
        );

        if (!overlapping.isEmpty()) {
            Showtime conflict = overlapping.get(0);
            throw new BadRequestException("Lịch chiếu bị trùng với suất chiếu đã tồn tại (" 
                    + conflict.getStartTime() + " -> " + conflict.getEndTime() + ") trong phòng " + auditorium.getName());
        }

        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(endTime);
        showtime.setBasePrice(request.getBasePrice());
        showtime.setMovie(movie);
        showtime.setAuditorium(auditorium);

        Showtime updated = showtimeRepository.save(showtime);
        return mapToDetailResponse(updated);
    }

    @Transactional
    public void deleteShowtime(Long id) {
        if (!showtimeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Showtime not found with id: " + id);
        }
        showtimeRepository.deleteById(id);
    }

    public ShowtimeResponse getSeatAvailability(Long showtimeId) {
        return getShowtimeById(showtimeId);
    }

    private ShowtimeResponse mapToSummaryResponse(Showtime showtime) {
        ShowtimeResponse response = new ShowtimeResponse();
        response.setId(showtime.getId());
        response.setStartTime(showtime.getStartTime());
        response.setEndTime(showtime.getEndTime());
        response.setBasePrice(showtime.getBasePrice());
        response.setStatus(showtime.getStatus());

        if (showtime.getMovie() != null) {
            response.setMovieId(showtime.getMovie().getId());
            response.setMovieTitle(showtime.getMovie().getTitle());
            response.setMoviePosterUrl(showtime.getMovie().getPosterUrl());
            response.setMovieDuration(showtime.getMovie().getDuration());
            response.setMovieAgeRating(showtime.getMovie().getRated());
        }

        if (showtime.getAuditorium() != null) {
            response.setAuditoriumId(showtime.getAuditorium().getId());
            response.setAuditoriumName(showtime.getAuditorium().getName());
            if (showtime.getAuditorium().getCinema() != null) {
                response.setCinemaId(showtime.getAuditorium().getCinema().getId());
                response.setCinemaName(showtime.getAuditorium().getCinema().getName());
                response.setCinemaAddress(showtime.getAuditorium().getCinema().getAddress());
            }
        }
        return response;
    }

    private ShowtimeResponse mapToDetailResponse(Showtime showtime) {
        ShowtimeResponse response = mapToSummaryResponse(showtime);

        // Fetch occupied seats for this showtime (ACTIVE or CHECKED_IN tickets)
        List<Long> occupiedSeatIds = ticketRepository.findBookedSeatIdsByShowtimeId(
                showtime.getId(),
                Arrays.asList(TicketStatus.ACTIVE, TicketStatus.CHECKED_IN)
        );
        response.setOccupiedSeatIds(occupiedSeatIds);

        // Load all seats of auditorium
        if (showtime.getAuditorium() != null) {
            List<Seat> seats = seatRepository.findByAuditoriumIdOrderByRowNameAscSeatNumberAsc(showtime.getAuditorium().getId());
            List<SeatResponse> seatResponses = seats.stream().map(s -> {
                boolean isOccupied = occupiedSeatIds.contains(s.getId());
                return new SeatResponse(s.getId(), s.getRowName(), s.getSeatNumber(), s.getType(), isOccupied);
            }).collect(Collectors.toList());
            response.setSeats(seatResponses);
        }

        return response;
    }
}
