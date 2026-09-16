package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.AuditoriumRequest;
import com.cinego.backend.dto.response.AuditoriumResponse;
import com.cinego.backend.dto.response.SeatResponse;
import com.cinego.backend.service.AuditoriumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auditoriums")
@Tag(name = "Auditoriums", description = "API quản lý phòng chiếu và sơ đồ ghế")
@CrossOrigin(origins = "*")
public class AuditoriumController {

    private final AuditoriumService auditoriumService;

    public AuditoriumController(AuditoriumService auditoriumService) {
        this.auditoriumService = auditoriumService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách phòng chiếu (có thể lọc theo cinemaId)")
    public ResponseEntity<ApiResponse<List<AuditoriumResponse>>> getAuditoriums(
            @RequestParam(required = false) Long cinemaId
    ) {
        List<AuditoriumResponse> list = (cinemaId != null) 
                ? auditoriumService.getAuditoriumsByCinema(cinemaId)
                : auditoriumService.getAllAuditoriums();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết phòng chiếu và danh sách ghế")
    public ResponseEntity<ApiResponse<AuditoriumResponse>> getAuditoriumById(@PathVariable Long id) {
        AuditoriumResponse auditorium = auditoriumService.getAuditoriumById(id);
        return ResponseEntity.ok(ApiResponse.success(auditorium));
    }

    @GetMapping("/{id}/seats")
    @Operation(summary = "Lấy danh sách sơ đồ ghế của phòng chiếu")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsByAuditorium(@PathVariable Long id) {
        List<SeatResponse> seats = auditoriumService.getSeatsByAuditorium(id);
        return ResponseEntity.ok(ApiResponse.success(seats));
    }

    @PostMapping
    @Operation(summary = "Tạo mới phòng chiếu và tự động sinh sơ đồ ghế (Admin)")
    public ResponseEntity<ApiResponse<AuditoriumResponse>> createAuditorium(
            @Valid @RequestBody AuditoriumRequest request
    ) {
        AuditoriumResponse created = auditoriumService.createAuditorium(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Tạo phòng chiếu và sinh ghế thành công"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phòng chiếu (Admin)")
    public ResponseEntity<ApiResponse<String>> deleteAuditorium(@PathVariable Long id) {
        auditoriumService.deleteAuditorium(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phòng chiếu thành công"));
    }
}
