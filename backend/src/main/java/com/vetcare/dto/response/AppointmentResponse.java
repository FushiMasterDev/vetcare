package com.vetcare.dto.response;

import com.vetcare.enums.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private UserResponse user;
    private DoctorResponse doctor;
    private ServiceResponse service;
    private BranchResponse branch;
    private String petName;
    private String petType;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String notes;
    private AppointmentStatus status;
    private Boolean termsAccepted;
    private String cancelReason;
    private LocalDateTime createdAt;
}
