package com.vetcare.controller;

import com.vetcare.dto.request.ServiceRequest;
import com.vetcare.dto.response.ServiceResponse;
import com.vetcare.service.impl.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAll() {
        return ResponseEntity.ok(serviceService.getAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(serviceService.search(keyword));
    }

    @GetMapping("/by-symptom")
    public ResponseEntity<List<ServiceResponse>> bySymptom(@RequestParam String symptom) {
        return ResponseEntity.ok(serviceService.findBySymptom(symptom));
    }

    @GetMapping("/by-specialization")
    public ResponseEntity<List<ServiceResponse>> bySpecialization(@RequestParam String specialization) {
        return ResponseEntity.ok(serviceService.findBySpecialization(specialization));
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> specializations() {
        return ResponseEntity.ok(serviceService.getAllSpecializations());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> create(@Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
