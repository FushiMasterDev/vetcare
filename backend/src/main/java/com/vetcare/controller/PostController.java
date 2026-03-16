package com.vetcare.controller;

import com.vetcare.dto.request.CommentRequest;
import com.vetcare.dto.request.PostRequest;
import com.vetcare.dto.response.CommentResponse;
import com.vetcare.dto.response.PostResponse;
import com.vetcare.repository.UserRepository;
import com.vetcare.service.impl.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAll() {
        return ResponseEntity.ok(postService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long uid = userDetails != null ? getUserId(userDetails) : null;
        return ResponseEntity.ok(postService.getById(id, uid));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostResponse>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.search(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<PostResponse>> byCategory(@PathVariable String category) {
        return ResponseEntity.ok(postService.getByCategory(category));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.create(getUserId(userDetails), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.update(id, getUserId(userDetails), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        postService.delete(id, getUserId(userDetails), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.toggleLike(id, getUserId(userDetails)));
    }

    // Comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommentRequest request) {
        return ResponseEntity.ok(postService.addComment(id, getUserId(userDetails), request));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        postService.deleteComment(commentId, getUserId(userDetails), isAdmin);
        return ResponseEntity.noContent().build();
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}
