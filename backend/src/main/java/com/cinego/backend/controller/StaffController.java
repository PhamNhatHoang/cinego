package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff")
public class StaffController {

    // TODO [MEMBER-2]: Implement staff-specific endpoints here (e.g. shift reports, list checked-in tickets)
    
    @GetMapping("/hello")
    public ApiResponse<String> staffHello() {
        return ApiResponse.success("Hello Staff", "Staff area");
    }
}
