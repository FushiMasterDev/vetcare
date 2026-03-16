package com.vetcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BranchResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String phone;
    private String email;
    private String imageUrl;
    private String mapUrl;
    private Double latitude;
    private Double longitude;
    private String openingHours;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
}
