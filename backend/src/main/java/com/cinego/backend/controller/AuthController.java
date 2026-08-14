package com.cinego.backend.controller;

import com.cinego.backend.common.ApiResponse;
import com.cinego.backend.dto.request.LoginRequest;
import com.cinego.backend.dto.request.RegisterRequest;
import com.cinego.backend.dto.response.AuthResponse;
import com.cinego.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success(response, "Login successful");
    }

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success("Registration successful", "User registered successfully");
    }
}
