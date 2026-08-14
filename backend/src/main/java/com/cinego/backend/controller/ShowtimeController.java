package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.ShowtimeRequest;
import com.cinego.backend.dto.response.ShowtimeResponse;
import com.cinego.backend.service.ShowtimeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/showtimes")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping
    public ApiResponse<List<ShowtimeResponse>> getShowtimes(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long cinemaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimes(movieId, cinemaId, date);
        return ApiResponse.success(showtimes, "Showtimes retrieved successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<ShowtimeResponse> getShowtimeById(@PathVariable Long id) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(id);
        return ApiResponse.success(showtime, "Showtime retrieved successfully");
    }

    @PostMapping
    public ApiResponse<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        // TODO [MEMBER-2]: Restrict to ADMIN role
        ShowtimeResponse created = showtimeService.createShowtime(request);
        return ApiResponse.success(created, "Showtime created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<ShowtimeResponse> updateShowtime(@PathVariable Long id, @Valid @RequestBody ShowtimeRequest request) {
        // TODO [MEMBER-2]: Restrict to ADMIN role
        ShowtimeResponse updated = showtimeService.updateShowtime(id, request);
        return ApiResponse.success(updated, "Showtime updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteShowtime(@PathVariable Long id) {
        // TODO [MEMBER-2]: Restrict to ADMIN role
        showtimeService.deleteShowtime(id);
        return ApiResponse.success("Showtime deleted successfully", "Showtime deleted successfully");
    }
}
