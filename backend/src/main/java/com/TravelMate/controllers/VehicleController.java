package com.TravelMate.controllers;

import com.TravelMate.entities.Vehicle;
import com.TravelMate.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            return ResponseEntity.ok(vehicle.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle not found");
    }

    @PostMapping
    public ResponseEntity<?> addVehicle(@RequestBody Vehicle vehicle) {
        if (vehicle.getName() == null || vehicle.getCategory() == null) {
            return ResponseEntity.badRequest().body("Name and Category are required");
        }
        Vehicle saved = vehicleRepository.save(vehicle);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody Vehicle details) {
        Optional<Vehicle> optional = vehicleRepository.findById(id);
        if (!optional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle not found");
        }
        Vehicle vehicle = optional.get();
        if (details.getName() != null) vehicle.setName(details.getName());
        if (details.getCategory() != null) vehicle.setCategory(details.getCategory());
        if (details.getImageUrl() != null) vehicle.setImageUrl(details.getImageUrl());
        if (details.getPricePerDay() != null) vehicle.setPricePerDay(details.getPricePerDay());
        if (details.getFeatures() != null) vehicle.setFeatures(details.getFeatures());
        if (details.getStatus() != null) vehicle.setStatus(details.getStatus());
        if (details.getDescription() != null) vehicle.setDescription(details.getDescription());

        return ResponseEntity.ok(vehicleRepository.save(vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        if (!vehicleRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehicle not found");
        }
        vehicleRepository.deleteById(id);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }
}
