// ✅ CommentController.java（多租户逻辑）
package com.devboard.controller;

import com.devboard.model.Comment;
import com.devboard.repository.CommentRepository;
import com.devboard.security.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final AuthUtil authUtil;

    public CommentController(CommentRepository commentRepository, AuthUtil authUtil) {
        this.commentRepository = commentRepository;
        this.authUtil = authUtil;
    }

    @GetMapping("/task/{taskId}")
    public List<Comment> getCommentsByTaskId(@PathVariable Long taskId) {
        return commentRepository.findByTaskIdAndTenantId(taskId, authUtil.getCurrentTenantId());
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {
        comment.setTenantId(authUtil.getCurrentTenantId());
        return commentRepository.save(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        Optional<Comment> comment = commentRepository.findByIdAndTenantId(id, authUtil.getCurrentTenantId());
        if (comment.isEmpty()) return ResponseEntity.notFound().build();
        commentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Comment> getAllCommentsByTenant() {
        Long tenantId = authUtil.getCurrentTenantId();
        return commentRepository.findByTenantId(tenantId);
    }

    @GetMapping("/task/{taskId}/top")
    public List<Comment> getTopLevelCommentsSorted(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        Long tenantId = authUtil.getCurrentTenantId();
        if ("asc".equalsIgnoreCase(sort)) {
            return commentRepository.findByTaskIdAndTenantIdAndParentIdIsNullOrderByCreatedAtAsc(taskId, tenantId);
        } else {
            return commentRepository.findByTaskIdAndTenantIdAndParentIdIsNullOrderByCreatedAtDesc(taskId, tenantId);
        }
    }

    @GetMapping("/{taskId}/top")
    public List<Comment> getTopLevelComments(@PathVariable Long taskId) {
        return commentRepository.findByTaskIdAndTenantIdAndParentIdIsNull(taskId, authUtil.getCurrentTenantId());
    }



}
