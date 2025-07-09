package com.devboard.controller;

import com.devboard.dto.CommentDeleteRequest;
import com.devboard.model.Comment;
import com.devboard.model.User;
import com.devboard.repository.CommentRepository;
import com.devboard.security.AuthUtil;
import com.devboard.security.TenantGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepo;
    private final TenantGuard tenantGuard;
    private final AuthUtil authUtil;

    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Page<Comment>> getCommentsPaged(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        User currentUser = authUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        Sort.Direction dir = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, "createdAt"));
        return ResponseEntity.ok(commentRepo.findByTaskId(taskId, pageable));
    }

    @GetMapping("/{taskId}/all")
    public ResponseEntity<List<Comment>> getAllComments(@PathVariable Long taskId) {
        User currentUser = authUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(commentRepo.findByTaskIdOrderByCreatedAtAsc(taskId));
    }

    @GetMapping("/{taskId}/top")
    public ResponseEntity<List<Comment>> getTopLevelComments(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        User currentUser = authUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        Sort.Direction dir = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        return ResponseEntity.ok(commentRepo.findByTaskIdAndParentIdIsNull(taskId, Sort.by(dir, "createdAt")));
    }

    @GetMapping("/replies/{parentId}")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable Long parentId) {
        User currentUser = authUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfComment(parentId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(commentRepo.findByParentIdOrderByCreatedAtAsc(parentId));
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        User currentUser = authUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(comment.getTaskId(), currentUser)) {
            return ResponseEntity.status(403).body("❌ No permission to comment on this task");
        }
        comment.setCreatedAt(java.time.LocalDateTime.now());
        comment.setUserId(currentUser.getId());
        comment.setUsername(currentUser.getUsername());
        return ResponseEntity.ok(commentRepo.save(comment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestBody CommentDeleteRequest req) {
        User currentUser = authUtil.getCurrentUser();
        Optional<Comment> opt = commentRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Comment c = opt.get();
        if (!tenantGuard.isMemberOfComment(id, currentUser)) {
            return ResponseEntity.status(403).body("❌ Not your project");
        }
        if (!req.getRole().equals("Admin") && !c.getUserId().equals(req.getUserId())) {
            return ResponseEntity.status(403).body("❌ Not allowed to delete this comment");
        }
        commentRepo.delete(c);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody Comment updated
    ) {
        User currentUser = authUtil.getCurrentUser();
        Optional<Comment> opt = commentRepo.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Comment ex = opt.get();
        if (!tenantGuard.isMemberOfComment(id, currentUser)) {
            return ResponseEntity.status(403).body("❌ Not your project");
        }
        if (!ex.getUserId().equals(updated.getUserId())) {
            return ResponseEntity.status(403).body("❌ Not allowed to edit this comment");
        }
        ex.setContent(updated.getContent());
        commentRepo.save(ex);
        return ResponseEntity.ok(ex);
    }
}
