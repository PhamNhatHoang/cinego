package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff")
@Tag(name = "Staff", description = "API dành cho nhân viên rạp")
@CrossOrigin(origins = "*")
public class StaffController {

    @GetMapping("/hello")
    public ApiResponse<String> staffHello() {
        return ApiResponse.success("Hello Staff", "Staff area");
    }
}
