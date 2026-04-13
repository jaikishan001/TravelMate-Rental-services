package com.TravelMate.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.TravelMate.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/register", "/api/users/login", "/api/users/setup-admin").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/vehicles", "/api/vehicles/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/vehicles").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers(HttpMethod.PUT, "/api/vehicles/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers(HttpMethod.DELETE, "/api/vehicles/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/moderator/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/api/user/**").hasAnyRole("ADMIN", "MODERATOR", "USER")
                .anyRequest().authenticated()
            )
            .httpBasic(AbstractHttpConfigurer::disable); // disable basic auth
            
        // Add JWT filter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
