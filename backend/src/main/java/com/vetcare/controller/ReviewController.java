package com.vetcare.controller;

import com.vetcare.dto.request.ReviewRequest;
import com.vetcare.dto.response.ReviewResponse;
import com.vetcare.repository.UserRepository;
import com.vetcare.service.impl.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ReviewResponse>> byService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reviewService.getByService(serviceId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<ReviewResponse>> byDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(reviewService.getByDoctor(doctorId));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        Long uid = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow().getId();
        return ResponseEntity.ok(reviewService.create(uid, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long uid = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow().getId();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        reviewService.delete(id, uid, isAdmin);
        return ResponseEntity.noContent().build();
    }
}
