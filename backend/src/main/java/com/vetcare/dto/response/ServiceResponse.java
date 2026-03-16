package com.vetcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private String imageUrl;
    private BigDecimal price;
    private Integer durationMinutes;
    private String specialization;
    private List<String> symptoms;
    private Boolean active;
    private Double avgRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
}
