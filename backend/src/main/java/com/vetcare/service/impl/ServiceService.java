package com.vetcare.service.impl;

import com.vetcare.dto.request.ServiceRequest;
import com.vetcare.dto.response.ServiceResponse;
import com.vetcare.entity.Service;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.ReviewRepository;
import com.vetcare.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final ReviewRepository reviewRepository;

    public List<ServiceResponse> getAllActive() {
        return serviceRepository.findByActiveTrue().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> getAll() {
        return serviceRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public ServiceResponse getById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        return toResponse(service);
    }

    public List<ServiceResponse> search(String keyword) {
        return serviceRepository.searchByKeyword(keyword).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> findBySymptom(String symptom) {
        return serviceRepository.findBySymptom(symptom).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ServiceResponse> findBySpecialization(String specialization) {
        return serviceRepository.findBySpecialization(specialization).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<String> getAllSpecializations() {
        return serviceRepository.findAllSpecializations();
    }

    @Transactional
    public ServiceResponse create(ServiceRequest request) {
        Service service = Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .specialization(request.getSpecialization())
                .symptoms(request.getSymptoms() != null ? request.getSymptoms() : List.of())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public ServiceResponse update(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setShortDescription(request.getShortDescription());
        service.setImageUrl(request.getImageUrl());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setSpecialization(request.getSpecialization());
        if (request.getSymptoms() != null) service.setSymptoms(request.getSymptoms());
        if (request.getActive() != null) service.setActive(request.getActive());
        return toResponse(serviceRepository.save(service));
    }

    @Transactional
    public void delete(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
        service.setActive(false);
        serviceRepository.save(service);
    }

    @Transactional
    public ServiceResponse toResponse(Service s) {
        Double avgRating = reviewRepository.avgRatingByServiceId(s.getId());
        return ServiceResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .shortDescription(s.getShortDescription())
                .imageUrl(s.getImageUrl())
                .price(s.getPrice())
                .durationMinutes(s.getDurationMinutes())
                .specialization(s.getSpecialization())
                .symptoms(s.getSymptoms())
                .active(s.getActive())
                .avgRating(avgRating)
                .createdAt(s.getCreatedAt())
                .build();
    }
}
