package com.vetcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    @NotNull
    private Long doctorId;

    @NotNull
    private Long serviceId;

    @NotNull
    private Long branchId;

    private Long petId;

    @NotNull
    private LocalDate appointmentDate;

    @NotNull
    private LocalTime appointmentTime;

    @NotBlank
    private String reason;

    private String notes;
    private String petName;
    private String petType;

    @NotNull
    private Boolean termsAccepted;
}
