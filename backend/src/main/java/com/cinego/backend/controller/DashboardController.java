package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.response.DashboardResponse;
import com.cinego.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@Tag(name = "Dashboard", description = "API thống kê tổng quan cho Admin")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Lấy thống kê tổng quan Dashboard (KPI, biểu đồ, giao dịch gần đây)")
    public ApiResponse<DashboardResponse> getStats() {
        DashboardResponse stats = dashboardService.getDashboardStatistics();
        return ApiResponse.success(stats, "Dashboard statistics retrieved successfully");
    }
}
