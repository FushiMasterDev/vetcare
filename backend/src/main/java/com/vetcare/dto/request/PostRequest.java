package com.vetcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostRequest {
    @NotBlank private String title;
    @NotBlank private String content;
    private String imageUrl;
    private String category;
    private String tags;
    private Boolean published = true;
}
