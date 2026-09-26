package com.cinego.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI cinegoOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CineGo Cinema API")
                        .version("1.0.0")
                        .description("REST API cho hệ thống quản lý rạp chiếu phim CineGo. "
                                + "Bao gồm quản lý phim, suất chiếu, đặt vé, thanh toán, soát vé và dashboard thống kê.")
                        .contact(new Contact()
                                .name("CineGo Team")
                                .email("contact@cinego.vn"))
                        .license(new License()
                                .name("MIT License")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .schemaRequirement("Bearer Authentication",
                        new SecurityScheme()
                                .name("Bearer Authentication")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Nhập JWT token. Ví dụ: eyJhbGciOiJIUzI1NiJ9..."));
    }
}
