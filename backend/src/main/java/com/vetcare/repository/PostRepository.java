package com.vetcare.repository;

import com.vetcare.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByPublishedTrueOrderByCreatedAtDesc();
    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    List<Post> findByCategoryAndPublishedTrue(String category);

    @Query("SELECT p FROM Post p WHERE p.published = true AND (" +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Post> searchPosts(@Param("keyword") String keyword);
}
