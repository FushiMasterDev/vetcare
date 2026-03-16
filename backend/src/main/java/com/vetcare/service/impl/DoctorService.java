package com.vetcare.service.impl;

import com.vetcare.dto.request.DoctorRequest;
import com.vetcare.dto.response.BranchResponse;
import com.vetcare.dto.response.DoctorResponse;
import com.vetcare.dto.response.ServiceResponse;
import com.vetcare.entity.Branch;
import com.vetcare.entity.Doctor;
import com.vetcare.entity.Service;
import com.vetcare.entity.User;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;

    public List<DoctorResponse> getAll() {
        return doctorRepository.findByActiveTrue().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public DoctorResponse getById(Long id) {
        return toResponse(doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id)));
    }

    public List<DoctorResponse> getByBranch(Long branchId) {
        return doctorRepository.findByBranchIdAndActiveTrue(branchId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<DoctorResponse> getByService(Long serviceId) {
        return doctorRepository.findByServiceId(serviceId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<DoctorResponse> search(String keyword) {
        return doctorRepository.searchDoctors(keyword).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DoctorResponse create(DoctorRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", req.getUserId()));

        Branch branch = req.getBranchId() != null ?
                branchRepository.findById(req.getBranchId()).orElse(null) : null;

        List<Service> services = req.getServiceIds() != null ?
                serviceRepository.findAllById(req.getServiceIds()) : List.of();

        Doctor doctor = Doctor.builder()
                .user(user).specialization(req.getSpecialization())
                .licenseNumber(req.getLicenseNumber()).education(req.getEducation())
                .experience(req.getExperience()).bio(req.getBio())
                .avatarUrl(req.getAvatarUrl()).yearsOfExperience(req.getYearsOfExperience())
                .branch(branch).services(services).active(true).build();

        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse update(Long id, DoctorRequest req) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));

        doctor.setSpecialization(req.getSpecialization());
        doctor.setLicenseNumber(req.getLicenseNumber());
        doctor.setEducation(req.getEducation());
        doctor.setExperience(req.getExperience());
        doctor.setBio(req.getBio());
        doctor.setYearsOfExperience(req.getYearsOfExperience());
        if (req.getAvatarUrl() != null) doctor.setAvatarUrl(req.getAvatarUrl());
        if (req.getActive() != null) doctor.setActive(req.getActive());

        if (req.getBranchId() != null) {
            Branch branch = branchRepository.findById(req.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch", req.getBranchId()));
            doctor.setBranch(branch);
        }
        if (req.getServiceIds() != null) {
            doctor.setServices(serviceRepository.findAllById(req.getServiceIds()));
        }
        return toResponse(doctorRepository.save(doctor));
    }

    @Transactional
    public void delete(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public DoctorResponse toResponse(Doctor d) {
        Double rating = reviewRepository.avgRatingByDoctorId(d.getId());
        return DoctorResponse.builder()
                .id(d.getId())
                .userId(d.getUser().getId())
                .fullName(d.getUser().getFullName())
                .email(d.getUser().getEmail())
                .avatarUrl(d.getAvatarUrl() != null ? d.getAvatarUrl() : d.getUser().getAvatarUrl())
                .specialization(d.getSpecialization())
                .licenseNumber(d.getLicenseNumber())
                .education(d.getEducation()).experience(d.getExperience())
                .bio(d.getBio()).yearsOfExperience(d.getYearsOfExperience())
                .rating(rating).active(d.getActive())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
