package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.BookingRequest;
import com.cinego.backend.dto.request.MockPaymentRequest;
import com.cinego.backend.dto.response.BookingResponse;
import com.cinego.backend.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "API đặt vé và thanh toán mô phỏng")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Tạo đơn đặt vé (Trạng thái PENDING giữ chỗ)")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            Principal principal
    ) {
        String username = (principal != null) ? principal.getName() : null;
        BookingResponse booking = bookingService.createBooking(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(booking, "Tạo đơn đặt vé thành công"));
    }

    @PostMapping("/{id}/payment")
    @Operation(summary = "Thanh toán mô phỏng (Chuyển sang PAID và sinh vé điện tử)")
    public ResponseEntity<ApiResponse<BookingResponse>> processPayment(
            @PathVariable Long id,
            @RequestBody(required = false) MockPaymentRequest paymentRequest,
            @RequestParam(required = false, defaultValue = "MOMO") String paymentMethod
    ) {
        String method = (paymentRequest != null && paymentRequest.getPaymentMethod() != null)
                ? paymentRequest.getPaymentMethod()
                : paymentMethod;
        BookingResponse booking = bookingService.processMockPayment(id, method);
        return ResponseEntity.ok(ApiResponse.success(booking, "Thanh toán thành công"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết đơn đặt vé theo ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Lấy lịch sử các đơn đặt vé của người dùng hiện tại")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Principal principal) {
        String username = (principal != null) ? principal.getName() : "customer";
        List<BookingResponse> history = bookingService.getUserBookingHistory(username);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các đơn đặt vé (Admin)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Hủy đơn đặt vé")
    public ResponseEntity<ApiResponse<String>> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Hủy đơn đặt vé thành công"));
    }
}
