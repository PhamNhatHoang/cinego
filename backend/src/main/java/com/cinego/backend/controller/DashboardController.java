package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.response.DashboardResponse;
import com.cinego.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ApiResponse<DashboardResponse> getStats() {
        // TODO [MEMBER-2]: Restrict to ADMIN role
        DashboardResponse stats = dashboardService.getDashboardStatistics();
        return ApiResponse.success(stats, "Dashboard statistics retrieved successfully");
    }
}
