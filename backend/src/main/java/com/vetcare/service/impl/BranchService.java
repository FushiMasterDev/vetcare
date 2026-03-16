package com.vetcare.service.impl;

import com.vetcare.dto.request.BranchRequest;
import com.vetcare.dto.response.BranchResponse;
import com.vetcare.entity.Branch;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;

    public List<BranchResponse> getAll() {
        return branchRepository.findByActiveTrue().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public BranchResponse getById(Long id) {
        return toResponse(branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id)));
    }

    @Transactional
    public BranchResponse create(BranchRequest req) {
        Branch branch = Branch.builder()
                .name(req.getName()).address(req.getAddress()).city(req.getCity())
                .phone(req.getPhone()).email(req.getEmail()).imageUrl(req.getImageUrl())
                .mapUrl(req.getMapUrl()).latitude(req.getLatitude()).longitude(req.getLongitude())
                .openingHours(req.getOpeningHours()).description(req.getDescription())
                .active(true).build();
        return toResponse(branchRepository.save(branch));
    }

    @Transactional
    public BranchResponse update(Long id, BranchRequest req) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
        branch.setName(req.getName()); branch.setAddress(req.getAddress());
        branch.setCity(req.getCity()); branch.setPhone(req.getPhone());
        branch.setEmail(req.getEmail()); branch.setImageUrl(req.getImageUrl());
        branch.setMapUrl(req.getMapUrl()); branch.setLatitude(req.getLatitude());
        branch.setLongitude(req.getLongitude()); branch.setOpeningHours(req.getOpeningHours());
        branch.setDescription(req.getDescription());
        if (req.getActive() != null) branch.setActive(req.getActive());
        return toResponse(branchRepository.save(branch));
    }

    @Transactional
    public void delete(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch", id));
        branch.setActive(false);
        branchRepository.save(branch);
    }

    public BranchResponse toResponse(Branch b) {
        return BranchResponse.builder()
                .id(b.getId()).name(b.getName()).address(b.getAddress()).city(b.getCity())
                .phone(b.getPhone()).email(b.getEmail()).imageUrl(b.getImageUrl())
                .mapUrl(b.getMapUrl()).latitude(b.getLatitude()).longitude(b.getLongitude())
                .openingHours(b.getOpeningHours()).description(b.getDescription())
                .active(b.getActive()).createdAt(b.getCreatedAt()).build();
    }
}
