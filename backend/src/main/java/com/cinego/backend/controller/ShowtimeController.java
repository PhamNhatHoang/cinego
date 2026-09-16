package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.ShowtimeRequest;
import com.cinego.backend.dto.response.ShowtimeResponse;
import com.cinego.backend.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/showtimes")
@Tag(name = "Showtimes", description = "API quản lý lịch chiếu và sơ đồ ghế suất chiếu")
@CrossOrigin(origins = "*")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách suất chiếu theo phim, rạp hoặc ngày")
    public ResponseEntity<ApiResponse<List<ShowtimeResponse>>> getShowtimes(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long cinemaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimes(movieId, cinemaId, date);
        return ResponseEntity.ok(ApiResponse.success(showtimes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết suất chiếu (bao gồm sơ đồ ghế và trạng thái khả dụng)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getShowtimeById(@PathVariable Long id) {
        ShowtimeResponse showtime = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(ApiResponse.success(showtime));
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Lấy trạng thái ghế ngồi của suất chiếu")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> getSeatAvailability(@PathVariable Long id) {
        ShowtimeResponse showtime = showtimeService.getSeatAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(showtime));
    }

    @PostMapping
    @Operation(summary = "Thêm mới suất chiếu (Admin - Kiểm tra xung đột lịch chiếu)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> createShowtime(@Valid @RequestBody ShowtimeRequest request) {
        ShowtimeResponse created = showtimeService.createShowtime(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Tạo suất chiếu thành công"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật suất chiếu (Admin)")
    public ResponseEntity<ApiResponse<ShowtimeResponse>> updateShowtime(
            @PathVariable Long id,
            @Valid @RequestBody ShowtimeRequest request
    ) {
        ShowtimeResponse updated = showtimeService.updateShowtime(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Cập nhật suất chiếu thành công"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa suất chiếu (Admin)")
    public ResponseEntity<ApiResponse<String>> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa suất chiếu thành công"));
    }
}
