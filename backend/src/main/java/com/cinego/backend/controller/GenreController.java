package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.model.Genre;
import com.cinego.backend.service.GenreService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/genres")
public class GenreController {

    @Autowired
    private GenreService genreService;

    @GetMapping
    public ApiResponse<List<Genre>> getAllGenres() {
        List<Genre> genres = genreService.getAllGenres();
        return ApiResponse.success(genres, "Genres retrieved successfully");
    }

    @PostMapping
    public ApiResponse<Genre> createGenre(@Valid @RequestBody Genre genre) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        Genre created = genreService.createGenre(genre);
        return ApiResponse.success(created, "Genre created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<Genre> updateGenre(@PathVariable Long id, @Valid @RequestBody Genre genreDetails) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        Genre updated = genreService.updateGenre(id, genreDetails);
        return ApiResponse.success(updated, "Genre updated successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteGenre(@PathVariable Long id) {
        // TODO [MEMBER-1]: Restrict to ADMIN role
        genreService.deleteGenre(id);
        return ApiResponse.success("Genre deleted successfully", "Genre deleted successfully");
    }
}
