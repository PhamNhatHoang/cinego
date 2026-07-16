package com.cinego.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Tắt CSRF vì đây là stateless REST API
            .csrf(AbstractHttpConfigurer::disable)
            // Cấu hình phân quyền endpoint
            .authorizeHttpRequests(auth -> auth
                // Cho phép truy cập công khai vào Health check API
                .requestMatchers("/health").permitAll()
                // Cho phép truy cập công khai tài liệu API Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                // Tạm thời cho phép tất cả các request khác để test sườn dự án (Thành viên 1 sẽ cấu hình JWT ở bước sau)
                .anyRequest().permitAll()
            )
            // Thiết lập session là Stateless
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
