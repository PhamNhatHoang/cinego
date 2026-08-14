package com.cinego.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// TODO [MEMBER-1]: Import JWT filter, AuthenticationProvider, PasswordEncoder

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // TODO [MEMBER-1]: Inject JwtAuthenticationFilter
    // TODO [MEMBER-1]: Configure PasswordEncoder bean (BCryptPasswordEncoder)
    // TODO [MEMBER-1]: Configure AuthenticationManager bean

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/api-docs/**").permitAll()
                // TODO [MEMBER-1]: Configure role-based authorization:
                //   .requestMatchers("/auth/**").permitAll()
                //   .requestMatchers("/admin/**").hasRole("ADMIN")
                //   .requestMatchers("/staff/**").hasAnyRole("STAFF", "ADMIN")
                //   .anyRequest().authenticated()
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
            // TODO [MEMBER-1]: Add JWT filter before UsernamePasswordAuthenticationFilter
            // http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

