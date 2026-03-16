package com.vetcare.repository;

import com.vetcare.entity.Appointment;
import com.vetcare.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByBranchId(Long branchId);
    List<Appointment> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(@Param("status") AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end ORDER BY a.appointmentDate ASC")
    List<Appointment> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
