package com.vetcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CommentResponse {
    private Long id;
    private UserResponse user;
    private String content;
    private Integer likes;
    private Long parentId;
    private List<CommentResponse> replies;
    private LocalDateTime createdAt;
}
