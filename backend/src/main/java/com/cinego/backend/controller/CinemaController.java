package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.CinemaRequest;
import com.cinego.backend.dto.response.CinemaResponse;
import com.cinego.backend.service.CinemaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cinemas")
@Tag(name = "Cinemas", description = "API quản lý hệ thống rạp chiếu phim")
@CrossOrigin(origins = "*")
public class CinemaController {

    private final CinemaService cinemaService;

    public CinemaController(CinemaService cinemaService) {
        this.cinemaService = cinemaService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các rạp chiếu")
    public ResponseEntity<ApiResponse<List<CinemaResponse>>> getAllCinemas() {
        List<CinemaResponse> cinemas = cinemaService.getAllCinemas();
        return ResponseEntity.ok(ApiResponse.success(cinemas));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết rạp chiếu theo ID")
    public ResponseEntity<ApiResponse<CinemaResponse>> getCinemaById(@PathVariable Long id) {
        CinemaResponse cinema = cinemaService.getCinemaById(id);
        return ResponseEntity.ok(ApiResponse.success(cinema));
    }

    @PostMapping
    @Operation(summary = "Thêm mới rạp chiếu (Admin)")
    public ResponseEntity<ApiResponse<CinemaResponse>> createCinema(@Valid @RequestBody CinemaRequest request) {
        CinemaResponse created = cinemaService.createCinema(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Tạo rạp chiếu thành công"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin rạp chiếu (Admin)")
    public ResponseEntity<ApiResponse<CinemaResponse>> updateCinema(
            @PathVariable Long id,
            @Valid @RequestBody CinemaRequest request
    ) {
        CinemaResponse updated = cinemaService.updateCinema(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật rạp chiếu thành công"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa rạp chiếu (Admin)")
    public ResponseEntity<ApiResponse<String>> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa rạp chiếu thành công"));
    }
}
