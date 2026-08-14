package com.cinego.backend.model;

import com.cinego.backend.model.enums.MovieStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer duration;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MovieStatus status;

    // TODO [MEMBER-1]: Add remaining fields: director, cast, releaseDate, language, rated, posterUrl, trailerUrl
    // TODO [MEMBER-1]: Add ManyToMany relationship to Genre (join table movie_genres)
    // TODO [MEMBER-1]: Add OneToMany relationship to Showtime

    public Movie() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public MovieStatus getStatus() {
        return status;
    }

    public void setStatus(MovieStatus status) {
        this.status = status;
    }
}
