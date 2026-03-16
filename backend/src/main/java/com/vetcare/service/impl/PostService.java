package com.vetcare.service.impl;

import com.vetcare.dto.request.CommentRequest;
import com.vetcare.dto.request.PostRequest;
import com.vetcare.dto.response.CommentResponse;
import com.vetcare.dto.response.PostResponse;
import com.vetcare.dto.response.UserResponse;
import com.vetcare.entity.Comment;
import com.vetcare.entity.Post;
import com.vetcare.entity.User;
import com.vetcare.exception.ResourceNotFoundException;
import com.vetcare.repository.CommentRepository;
import com.vetcare.repository.PostRepository;
import com.vetcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public List<PostResponse> getAll() {
        return postRepository.findByPublishedTrueOrderByCreatedAtDesc().stream()
                .map(p -> toResponse(p, null)).collect(Collectors.toList());
    }

    public PostResponse getById(Long id, Long currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", id));
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
        return toResponse(post, currentUserId);
    }

    public List<PostResponse> search(String keyword) {
        return postRepository.searchPosts(keyword).stream()
                .map(p -> toResponse(p, null)).collect(Collectors.toList());
    }

    public List<PostResponse> getByCategory(String category) {
        return postRepository.findByCategoryAndPublishedTrue(category).stream()
                .map(p -> toResponse(p, null)).collect(Collectors.toList());
    }

    @Transactional
    public PostResponse create(Long userId, PostRequest req) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Post post = Post.builder()
                .author(author).title(req.getTitle()).content(req.getContent())
                .imageUrl(req.getImageUrl()).category(req.getCategory()).tags(req.getTags())
                .published(req.getPublished() != null ? req.getPublished() : true)
                .likes(0).views(0).build();
        return toResponse(postRepository.save(post), userId);
    }

    @Transactional
    public PostResponse update(Long id, Long userId, PostRequest req) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", id));
        if (!post.getAuthor().getId().equals(userId))
            throw new IllegalArgumentException("Not authorized");
        post.setTitle(req.getTitle()); post.setContent(req.getContent());
        post.setImageUrl(req.getImageUrl()); post.setCategory(req.getCategory());
        post.setTags(req.getTags());
        if (req.getPublished() != null) post.setPublished(req.getPublished());
        return toResponse(postRepository.save(post), userId);
    }

    @Transactional
    public void delete(Long id, Long userId, boolean isAdmin) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post", id));
        if (!isAdmin && !post.getAuthor().getId().equals(userId))
            throw new IllegalArgumentException("Not authorized");
        postRepository.delete(post);
    }

    @Transactional
    public PostResponse toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        boolean liked = post.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId));
        if (liked) {
            post.getLikedBy().removeIf(u -> u.getId().equals(userId));
            post.setLikes(Math.max(0, post.getLikes() - 1));
        } else {
            post.getLikedBy().add(user);
            post.setLikes(post.getLikes() + 1);
        }
        return toResponse(postRepository.save(post), userId);
    }

    // Comments
    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtAsc(postId).stream()
                .map(this::toCommentResponse).collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(Long postId, Long userId, CommentRequest req) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", postId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Comment parent = null;
        if (req.getParentId() != null) {
            parent = commentRepository.findById(req.getParentId()).orElse(null);
        }
        Comment comment = Comment.builder()
                .post(post).user(user).content(req.getContent()).parent(parent).likes(0).build();
        return toCommentResponse(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", commentId));
        if (!isAdmin && !comment.getUser().getId().equals(userId))
            throw new IllegalArgumentException("Not authorized");
        commentRepository.delete(comment);
    }

    private PostResponse toResponse(Post p, Long currentUserId) {
        boolean liked = currentUserId != null &&
                p.getLikedBy().stream().anyMatch(u -> u.getId().equals(currentUserId));
        Long commentCount = commentRepository.countByPostId(p.getId());
        return PostResponse.builder()
                .id(p.getId())
                .author(toUserResp(p.getAuthor()))
                .title(p.getTitle()).content(p.getContent())
                .imageUrl(p.getImageUrl()).category(p.getCategory()).tags(p.getTags())
                .likes(p.getLikes()).views(p.getViews()).commentCount(commentCount)
                .published(p.getPublished()).likedByCurrentUser(liked)
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt())
                .build();
    }

    private CommentResponse toCommentResponse(Comment c) {
        List<CommentResponse> replies = commentRepository
                .findByParentIdOrderByCreatedAtAsc(c.getId()).stream()
                .map(this::toCommentResponse).collect(Collectors.toList());
        return CommentResponse.builder()
                .id(c.getId()).user(toUserResp(c.getUser())).content(c.getContent())
                .likes(c.getLikes()).parentId(c.getParent() != null ? c.getParent().getId() : null)
                .replies(replies).createdAt(c.getCreatedAt()).build();
    }

    private UserResponse toUserResp(User u) {
        return UserResponse.builder().id(u.getId()).email(u.getEmail())
                .fullName(u.getFullName()).avatarUrl(u.getAvatarUrl()).role(u.getRole()).build();
    }
}
