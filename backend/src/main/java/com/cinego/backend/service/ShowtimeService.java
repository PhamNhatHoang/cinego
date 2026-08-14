package com.cinego.backend.service;

import com.cinego.backend.dto.request.ShowtimeRequest;
import com.cinego.backend.dto.response.ShowtimeResponse;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ShowtimeService {

    // TODO [MEMBER-2]: Inject ShowtimeRepository, MovieRepository, AuditoriumRepository

    public List<ShowtimeResponse> getShowtimes(Long movieId, Long cinemaId, LocalDate date) {
        // TODO [MEMBER-2]: Retrieve showtimes filtered by movie, cinema, and date
        return null;
    }

    public ShowtimeResponse getShowtimeById(Long id) {
        // TODO [MEMBER-2]: Retrieve showtime by ID and map to ShowtimeResponse (include occupied seats)
        return null;
    }

    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        // TODO [MEMBER-2]: Validate movie and auditorium existence
        // TODO [MEMBER-2]: Check for time overlap in the target auditorium:
        //   Conflict if: Start_new < End_exist AND End_new > Start_exist
        // TODO [MEMBER-2]: Save showtime and return response
        return null;
    }

    public ShowtimeResponse updateShowtime(Long id, ShowtimeRequest request) {
        // TODO [MEMBER-2]: Update showtime details with conflict validation
        return null;
    }

    public void deleteShowtime(Long id) {
        // TODO [MEMBER-2]: Delete showtime
    }
}
