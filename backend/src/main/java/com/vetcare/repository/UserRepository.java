package com.vetcare.repository;

import com.vetcare.entity.User;
import com.vetcare.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByActive(Boolean active);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchByKeyword(String keyword);
}
