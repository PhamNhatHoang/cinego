package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> checkHealth() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("app", "CineGo API Backend");
        healthInfo.put("javaVersion", System.getProperty("java.version"));
        
        return ApiResponse.success(healthInfo, "CineGo Backend is running smoothly!");
    }
}
