package com.vetcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PostResponse {
    private Long id;
    private UserResponse author;
    private String title;
    private String content;
    private String imageUrl;
    private String category;
    private String tags;
    private Integer likes;
    private Integer views;
    private Long commentCount;
    private Boolean published;
    private Boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
