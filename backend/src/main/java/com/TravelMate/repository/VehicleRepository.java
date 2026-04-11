package com.TravelMate.repository;

import com.TravelMate.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByCategory(String category);
    List<Vehicle> findByStatus(String status);
}
