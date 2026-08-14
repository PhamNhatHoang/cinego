package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.MovieRequest;
import com.cinego.backend.dto.response.MovieResponse;
import com.cinego.backend.service.MovieService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ApiResponse<List<MovieResponse>> getAllMovies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<MovieResponse> movies = movieService.getAllMovies(status, search);
        return ApiResponse.success(movies, "Movies retrieved successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ApiResponse.success(movie, "Movie retrieved successfully");
    }

    @PostMapping
    public ApiResponse<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        MovieResponse created = movieService.createMovie(request);
        return ApiResponse.success(created, "Movie created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<MovieResponse> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        MovieResponse updated = movieService.updateMovie(id, request);
        return ApiResponse.success(updated, "Movie updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMovie(@PathVariable Long id) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        movieService.deleteMovie(id);
        return ApiResponse.success("Movie deleted successfully", "Movie deleted successfully");
    }
}
