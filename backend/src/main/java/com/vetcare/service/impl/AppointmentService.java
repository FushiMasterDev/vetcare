package com.vetcare.service.impl;

import com.vetcare.dto.request.AppointmentRequest;
import com.vetcare.dto.response.AppointmentResponse;
import com.vetcare.dto.response.UserResponse;
import com.vetcare.entity.*;
import com.vetcare.enums.AppointmentStatus;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ServiceRepository serviceRepository;
    private final BranchRepository branchRepository;
    private final PetRepository petRepository;
    private final BranchService branchService;
    private final DoctorService doctorService;
    private final ServiceService serviceService;

    @Transactional
    public AppointmentResponse create(Long userId, AppointmentRequest req) {
        if (!req.getTermsAccepted()) throw new IllegalArgumentException("Terms must be accepted");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", req.getDoctorId()));
        com.vetcare.entity.Service service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service", req.getServiceId()));
        Branch branch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch", req.getBranchId()));

        Pet pet = null;
        if (req.getPetId() != null) {
            pet = petRepository.findById(req.getPetId()).orElse(null);
        }

        Appointment appointment = Appointment.builder()
                .user(user).doctor(doctor).service(service).branch(branch).pet(pet)
                .appointmentDate(req.getAppointmentDate())
                .appointmentTime(req.getAppointmentTime())
                .reason(req.getReason()).notes(req.getNotes())
                .petName(req.getPetName()).petType(req.getPetType())
                .status(AppointmentStatus.CONFIRMED)
                .termsAccepted(req.getTermsAccepted())
                .build();

        return toResponse(appointmentRepository.save(appointment));
    }

    public List<AppointmentResponse> getMyAppointments(Long userId) {
        return appointmentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAll() {
        return appointmentRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public AppointmentResponse getById(Long id) {
        return toResponse(appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id)));
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, AppointmentStatus status, String cancelReason) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
        apt.setStatus(status);
        if (cancelReason != null) apt.setCancelReason(cancelReason);
        return toResponse(appointmentRepository.save(apt));
    }

    @Transactional
    public void cancel(Long id, Long userId, String reason) {
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id));
        if (!apt.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Not authorized to cancel this appointment");
        apt.setStatus(AppointmentStatus.CANCELLED);
        apt.setCancelReason(reason);
        appointmentRepository.save(apt);
    }

    private AppointmentResponse toResponse(Appointment a) {
        UserResponse userResp = UserResponse.builder()
                .id(a.getUser().getId()).email(a.getUser().getEmail())
                .fullName(a.getUser().getFullName()).avatarUrl(a.getUser().getAvatarUrl())
                .phone(a.getUser().getPhone()).role(a.getUser().getRole()).build();

        return AppointmentResponse.builder()
                .id(a.getId()).user(userResp)
                .doctor(doctorService.toResponse(a.getDoctor()))
                .service(serviceService.toResponse(a.getService()))
                .branch(branchService.toResponse(a.getBranch()))
                .petName(a.getPetName()).petType(a.getPetType())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .reason(a.getReason()).notes(a.getNotes())
                .status(a.getStatus()).termsAccepted(a.getTermsAccepted())
                .cancelReason(a.getCancelReason()).createdAt(a.getCreatedAt())
                .build();
    }

    // expose for reuse
    public AppointmentResponse toResponsePublic(Appointment a) { return toResponse(a); }
}
