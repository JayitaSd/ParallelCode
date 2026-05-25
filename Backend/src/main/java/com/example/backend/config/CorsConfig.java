package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;

/**
 * CORS Configuration for REST APIs and WebSocket
 * Handles Cross-Origin Resource Sharing for frontend applications
 */
@Configuration
public class CorsConfig {
    private static final Logger logger = LoggerFactory.getLogger(CorsConfig.class);

    /**
     * Configure CORS for REST APIs
     * Allows requests from frontend applications
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow all origins (configure more restrictively in production)
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://localhost:5173",    // React Vite dev server
                "http://localhost:3000",    // Alternative React port
                "http://localhost:8080",    // Alternative port
                "http://127.0.0.1:*",
                "http://127.0.0.1:5173",    // React Vite dev server (127.0.0.1)
                "http://127.0.0.1:3000"
        ));

        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
                "Content-Type",
                "Authorization",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Expose specific headers to frontend
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        // Cache preflight requests for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        logger.info("✅ CORS Configuration initialized");
        logger.info("✅ Allowed Origins: localhost:*, 127.0.0.1:*");
        logger.info("✅ Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
        logger.info("✅ Credentials: Allowed");

        return source;
    }
}

