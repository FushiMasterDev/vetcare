package com.vetcare.repository;

import com.vetcare.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByActiveTrue();
    List<Doctor> findBySpecializationAndActiveTrue(String specialization);
    List<Doctor> findByBranchIdAndActiveTrue(Long branchId);
    Optional<Doctor> findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d WHERE d.active = true AND " +
           "(LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Doctor> searchDoctors(@Param("keyword") String keyword);

    @Query("SELECT d FROM Doctor d JOIN d.services s WHERE s.id = :serviceId AND d.active = true")
    List<Doctor> findByServiceId(@Param("serviceId") Long serviceId);
}
