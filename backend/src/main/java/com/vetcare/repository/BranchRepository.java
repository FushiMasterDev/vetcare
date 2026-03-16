package com.vetcare.repository;

import com.vetcare.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    List<Branch> findByActiveTrue();
    List<Branch> findByCityAndActiveTrue(String city);
}
