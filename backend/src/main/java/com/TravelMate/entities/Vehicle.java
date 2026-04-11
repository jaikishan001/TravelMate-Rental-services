package com.TravelMate.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String pricePerDay;

    @Column(columnDefinition = "TEXT")
    private String features; // Comma separated

    @Builder.Default
    @Column(nullable = false)
    private String status = "AVAILABLE"; // AVAILABLE, RENTED, MAINTENANCE
}
