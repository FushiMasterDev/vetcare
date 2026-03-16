package com.vetcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ServiceRequest {
    @NotBlank private String name;
    private String description;
    private String shortDescription;
    private String imageUrl;
    private BigDecimal price;
    private Integer durationMinutes;
    @NotBlank private String specialization;
    private List<String> symptoms;
    private Boolean active = true;
}
