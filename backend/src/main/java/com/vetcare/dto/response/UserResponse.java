package com.vetcare.dto.response;

import com.vetcare.enums.AuthProvider;
import com.vetcare.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String address;
    private Role role;
    private AuthProvider provider;
    private Boolean active;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
}
