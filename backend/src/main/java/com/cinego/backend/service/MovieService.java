package com.cinego.backend.service;

import com.cinego.backend.dto.request.MovieRequest;
import com.cinego.backend.dto.response.MovieResponse;
import com.cinego.backend.model.Genre;
import com.cinego.backend.model.Movie;
import com.cinego.backend.model.enums.MovieStatus;
import com.cinego.backend.repository.GenreRepository;
import com.cinego.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private GenreRepository genreRepository;

    public List<MovieResponse> getAllMovies(String status, String search) {
        List<Movie> movies = movieRepository.findAll();

        // Filter by status
        if (status != null && !status.isBlank()) {
            try {
                MovieStatus ms = MovieStatus.valueOf(status.toUpperCase());
                movies = movies.stream()
                        .filter(m -> m.getStatus() == ms)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException ignored) {
                // Invalid status string → skip filter
            }
        }

        // Filter by title search
        if (search != null && !search.isBlank()) {
            String lower = search.toLowerCase();
            movies = movies.stream()
                    .filter(m -> m.getTitle().toLowerCase().contains(lower))
                    .collect(Collectors.toList());
        }

        return movies.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        return toResponse(movie);
    }

    public MovieResponse createMovie(MovieRequest request) {
        Movie movie = new Movie();
        mapRequestToEntity(request, movie);
        Movie saved = movieRepository.save(movie);
        return toResponse(saved);
    }

    public MovieResponse updateMovie(Long id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
        mapRequestToEntity(request, movie);
        Movie saved = movieRepository.save(movie);
        return toResponse(saved);
    }

    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Movie not found with id: " + id);
        }
        movieRepository.deleteById(id);
    }

    // ── Mapping helpers ──

    private void mapRequestToEntity(MovieRequest request, Movie movie) {
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setDuration(request.getDuration());

        if (request.getStatus() != null) {
            try {
                movie.setStatus(MovieStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
            }
        }

        if (request.getGenreIds() != null && !request.getGenreIds().isEmpty()) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            movie.setGenres(new HashSet<>(genres));
        }
    }

    private MovieResponse toResponse(Movie movie) {
        MovieResponse r = new MovieResponse();
        r.setId(movie.getId());
        r.setTitle(movie.getTitle());
        r.setDescription(movie.getDescription());
        r.setDuration(movie.getDuration());
        r.setStatus(movie.getStatus() != null ? movie.getStatus().name() : null);
        r.setPosterUrl(movie.getPosterUrl());
        r.setTrailerUrl(movie.getTrailerUrl());
        r.setRated(movie.getRated());
        r.setReleaseDate(movie.getReleaseDate());
        r.setDirector(movie.getDirector());
        r.setCast(movie.getCast());
        r.setLanguage(movie.getLanguage());

        if (movie.getGenres() != null) {
            r.setGenres(movie.getGenres().stream()
                    .map(Genre::getName)
                    .collect(Collectors.toList()));
        }

        return r;
    }
}
