package com.vetcare.service.impl;

import com.vetcare.dto.request.ReviewRequest;
import com.vetcare.dto.response.ReviewResponse;
import com.vetcare.dto.response.UserResponse;
import com.vetcare.entity.Doctor;
import com.vetcare.entity.Review;
import com.vetcare.entity.User;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public ReviewResponse create(Long userId, ReviewRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Review.ReviewBuilder builder = Review.builder().user(user).rating(req.getRating()).comment(req.getComment());

        if (req.getServiceId() != null) {
            builder.service(serviceRepository.findById(req.getServiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Service", req.getServiceId())));
        }
        if (req.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(req.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor", req.getDoctorId()));
            builder.doctor(doctor);
            // update doctor rating
            doctor.setTotalReviews(doctor.getTotalReviews() == null ? 1 : doctor.getTotalReviews() + 1);
            Double avg = reviewRepository.avgRatingByDoctorId(req.getDoctorId());
            doctor.setRating(avg != null ? avg : req.getRating().doubleValue());
            doctorRepository.save(doctor);
        }
        if (req.getAppointmentId() != null) {
            builder.appointment(appointmentRepository.findById(req.getAppointmentId()).orElse(null));
        }

        return toResponse(reviewRepository.save(builder.build()));
    }

    public List<ReviewResponse> getByService(Long serviceId) {
        return reviewRepository.findByServiceIdOrderByCreatedAtDesc(serviceId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getByDoctor(Long doctorId) {
        return reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", id));
        if (!isAdmin && !review.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Not authorized");
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .user(UserResponse.builder()
                        .id(r.getUser().getId()).fullName(r.getUser().getFullName())
                        .avatarUrl(r.getUser().getAvatarUrl()).email(r.getUser().getEmail()).build())
                .serviceId(r.getService() != null ? r.getService().getId() : null)
                .doctorId(r.getDoctor() != null ? r.getDoctor().getId() : null)
                .rating(r.getRating()).comment(r.getComment()).createdAt(r.getCreatedAt())
                .build();
    }
}
