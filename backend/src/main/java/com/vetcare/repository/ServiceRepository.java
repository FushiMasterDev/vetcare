package com.vetcare.repository;

import com.vetcare.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();
    List<Service> findBySpecialization(String specialization);

    @Query("SELECT DISTINCT s FROM Service s WHERE s.active = true AND (" +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Service> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT s FROM Service s JOIN s.symptoms sym WHERE s.active = true AND " +
           "LOWER(sym) LIKE LOWER(CONCAT('%', :symptom, '%'))")
    List<Service> findBySymptom(@Param("symptom") String symptom);

    @Query("SELECT DISTINCT s.specialization FROM Service s WHERE s.active = true")
    List<String> findAllSpecializations();
}
