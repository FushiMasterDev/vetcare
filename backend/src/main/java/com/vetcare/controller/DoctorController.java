package com.vetcare.controller;

import com.vetcare.dto.request.DoctorRequest;
import com.vetcare.dto.response.DoctorResponse;
import com.vetcare.service.impl.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAll() {
        return ResponseEntity.ok(doctorService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getById(id));
    }

    @GetMapping("/by-branch/{branchId}")
    public ResponseEntity<List<DoctorResponse>> getByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(doctorService.getByBranch(branchId));
    }

    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<List<DoctorResponse>> getByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(doctorService.getByService(serviceId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(doctorService.search(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorResponse> create(@Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DoctorResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
