package com.vetcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String specialization;
    private String licenseNumber;
    private String education;
    private String experience;
    private String bio;
    private Integer yearsOfExperience;
    private Double rating;
    private Integer totalReviews;
    private BranchResponse branch;
    private List<ServiceResponse> services;
    private Boolean active;
    private LocalDateTime createdAt;
}
