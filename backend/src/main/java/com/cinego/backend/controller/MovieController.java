package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.MovieRequest;
import com.cinego.backend.dto.response.MovieResponse;
import com.cinego.backend.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movies")
@Tag(name = "Movies", description = "API quản lý phim")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    @Operation(summary = "Lấy danh sách phim (lọc theo status, search)")
    public ApiResponse<List<MovieResponse>> getAllMovies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<MovieResponse> movies = movieService.getAllMovies(status, search);
        return ApiResponse.success(movies, "Movies retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết phim theo ID")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ApiResponse.success(movie, "Movie retrieved successfully");
    }

    @PostMapping
    @Operation(summary = "Tạo phim mới (Admin)")
    public ApiResponse<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        MovieResponse created = movieService.createMovie(request);
        return ApiResponse.success(created, "Movie created successfully");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin phim (Admin)")
    public ApiResponse<MovieResponse> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        MovieResponse updated = movieService.updateMovie(id, request);
        return ApiResponse.success(updated, "Movie updated successfully");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phim (Admin)")
    public ApiResponse<String> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ApiResponse.success("Movie deleted successfully", "Movie deleted successfully");
    }
}
