package com.cinego.backend.service;

import com.cinego.backend.dto.request.MovieRequest;
import com.cinego.backend.dto.response.MovieResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovieService {

    // TODO [MEMBER-1]: Inject MovieRepository, GenreRepository

    public List<MovieResponse> getAllMovies(String status, String search) {
        // TODO [MEMBER-1]: Retrieve and filter movies (e.g. by status, title match)
        return null;
    }

    public MovieResponse getMovieById(Long id) {
        // TODO [MEMBER-1]: Retrieve movie by ID, map to MovieResponse
        return null;
    }

    public MovieResponse createMovie(MovieRequest request) {
        // TODO [MEMBER-1]: Create a new Movie entity, associate Genres, and save
        return null;
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        // TODO [MEMBER-1]: Update movie details and genres
        return null;
    }

    public void deleteMovie(Long id) {
        // TODO [MEMBER-1]: Delete movie by ID
    }
}
