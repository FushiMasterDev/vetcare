package com.vetcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BranchRequest {
    @NotBlank private String name;
    @NotBlank private String address;
    private String city;
    private String phone;
    private String email;
    private String imageUrl;
    private String mapUrl;
    private Double latitude;
    private Double longitude;
    private String openingHours;
    private String description;
    private Boolean active = true;
}
