package com.vetcare.service.impl;

import com.vetcare.dto.response.UserResponse;
import com.vetcare.entity.User;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getById(Long id) {
        return toResponse(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    public UserResponse getByEmail(String email) {
        return toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)));
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateProfile(Long id, String fullName, String phone, String address, String avatarUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        if (fullName != null) user.setFullName(fullName);
        if (phone != null) user.setPhone(phone);
        if (address != null) user.setAddress(address);
        if (avatarUrl != null) user.setAvatarUrl(avatarUrl);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    public UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId()).email(u.getEmail()).fullName(u.getFullName())
                .phone(u.getPhone()).avatarUrl(u.getAvatarUrl()).address(u.getAddress())
                .role(u.getRole()).provider(u.getProvider()).active(u.getActive())
                .emailVerified(u.getEmailVerified()).createdAt(u.getCreatedAt()).build();
    }
}
