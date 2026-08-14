package com.cinego.backend.service;

import com.cinego.backend.dto.request.LoginRequest;
import com.cinego.backend.dto.request.RegisterRequest;
import com.cinego.backend.dto.response.AuthResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    // TODO [MEMBER-1]: Inject UserRepository, RoleRepository, PasswordEncoder, JwtTokenProvider, AuthenticationManager

    public AuthResponse login(LoginRequest request) {
        // TODO [MEMBER-1]: Authenticate user using AuthenticationManager
        // TODO [MEMBER-1]: Generate JWT Token and build AuthResponse
        return new AuthResponse(null, request.getUsername(), null, null);
    }

    public void register(RegisterRequest request) {
        // TODO [MEMBER-1]: Check if username/email already exists (throw IllegalArgumentException if so)
        // TODO [MEMBER-1]: Encode password, assign ROLE_CUSTOMER, and save User to database
    }
}
