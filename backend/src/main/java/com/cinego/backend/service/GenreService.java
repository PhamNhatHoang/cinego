package com.cinego.backend.service;

import com.cinego.backend.model.Genre;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GenreService {

    // TODO [MEMBER-1]: Inject GenreRepository

    public List<Genre> getAllGenres() {
        // TODO [MEMBER-1]: Retrieve all genres
        return null;
    }

    public Genre createGenre(Genre genre) {
        // TODO [MEMBER-1]: Save new genre
        return null;
    }

    public Genre updateGenre(Long id, Genre genreDetails) {
        // TODO [MEMBER-1]: Update genre details
        return null;
    }

    public void deleteGenre(Long id) {
        // TODO [MEMBER-1]: Delete genre
    }
}
