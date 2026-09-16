package com.cinego.backend.service;

import com.cinego.backend.dto.request.CinemaRequest;
import com.cinego.backend.dto.response.CinemaResponse;
import com.cinego.backend.exception.ResourceNotFoundException;
import com.cinego.backend.model.Cinema;
import com.cinego.backend.repository.CinemaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CinemaService {

    private final CinemaRepository cinemaRepository;

    public CinemaService(CinemaRepository cinemaRepository) {
        this.cinemaRepository = cinemaRepository;
    }

    public List<CinemaResponse> getAllCinemas() {
        return cinemaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CinemaResponse getCinemaById(Long id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + id));
        return mapToResponse(cinema);
    }

    @Transactional
    public CinemaResponse createCinema(CinemaRequest request) {
        Cinema cinema = new Cinema(request.getName(), request.getAddress(), request.getHotline());
        Cinema saved = cinemaRepository.save(cinema);
        return mapToResponse(saved);
    }

    @Transactional
    public CinemaResponse updateCinema(Long id, CinemaRequest request) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + id));
        cinema.setName(request.getName());
        cinema.setAddress(request.getAddress());
        cinema.setHotline(request.getHotline());
        Cinema updated = cinemaRepository.save(cinema);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCinema(Long id) {
        if (!cinemaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cinema not found with id: " + id);
        }
        cinemaRepository.deleteById(id);
    }

    private CinemaResponse mapToResponse(Cinema cinema) {
        int totalAuditoriums = cinema.getAuditoriums() != null ? cinema.getAuditoriums().size() : 0;
        return new CinemaResponse(
                cinema.getId(),
                cinema.getName(),
                cinema.getAddress(),
                cinema.getHotline(),
                totalAuditoriums
        );
    }
}
