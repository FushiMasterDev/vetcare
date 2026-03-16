package com.vetcare.repository;

import com.vetcare.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByServiceIdOrderByCreatedAtDesc(Long serviceId);
    List<Review> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    List<Review> findByUserId(Long userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service.id = :serviceId")
    Double avgRatingByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctor.id = :doctorId")
    Double avgRatingByDoctorId(@Param("doctorId") Long doctorId);
}
