package com.vetcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class DoctorRequest {
    @NotNull private Long userId;
    @NotBlank private String specialization;
    private String licenseNumber;
    private String education;
    private String experience;
    private String bio;
    private String avatarUrl;
    private Integer yearsOfExperience;
    private Long branchId;
    private List<Long> serviceIds;
    private Boolean active = true;
}
