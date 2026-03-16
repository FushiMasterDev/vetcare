package com.vetcare.controller;

import com.vetcare.dto.response.AppointmentResponse;
import com.vetcare.dto.response.UserResponse;
import com.vetcare.enums.AppointmentStatus;
import com.vetcare.repository.AppointmentRepository;
import com.vetcare.repository.DoctorRepository;
import com.vetcare.repository.ServiceRepository;
import com.vetcare.repository.UserRepository;
import com.vetcare.service.impl.AppointmentService;
import com.vetcare.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;
    private final DoctorRepository doctorRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalServices", serviceRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("confirmedAppointments", appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED));
        stats.put("completedAppointments", appointmentRepository.countByStatus(AppointmentStatus.COMPLETED));
        stats.put("cancelledAppointments", appointmentRepository.countByStatus(AppointmentStatus.CANCELLED));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAll());
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<Void> toggleUserActive(@PathVariable Long id) {
        userService.toggleActive(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAll());
    }
}
