package com.devboard.controller;

import com.devboard.dto.CommentDeleteRequest;
import com.devboard.model.Comment;
import com.devboard.model.User;
import com.devboard.repository.CommentRepository;
import com.devboard.security.AuthUtil;
import com.devboard.security.TenantGuard;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentRepository commentRepo;
    private final TenantGuard tenantGuard;


    public CommentController(CommentRepository commentRepo, TenantGuard tenantGuard) {
        this.commentRepo = commentRepo;
        this.tenantGuard = tenantGuard;
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // ✅ 加入任务所属项目成员检查
    @GetMapping("/{taskId}")
    public ResponseEntity<Page<Comment>> getCommentsPaged(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }

        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        Page<Comment> pageResult = commentRepo.findByTaskId(taskId, pageable);
        return ResponseEntity.ok(pageResult);
    }

    // ✅ 同样校验权限
    @GetMapping("/{taskId}/all")
    public ResponseEntity<List<Comment>> getAllComments(@PathVariable Long taskId) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(commentRepo.findByTaskIdOrderByCreatedAtAsc(taskId));
    }

    // ✅ 新增权限验证
    @GetMapping("/{taskId}/top")
    public ResponseEntity<List<Comment>> getTopLevelComments(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(taskId, currentUser)) {
            return ResponseEntity.status(403).build();
        }

        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        List<Comment> list = commentRepo.findByTaskIdAndParentIdIsNull(taskId, Sort.by(direction, "createdAt"));
        return ResponseEntity.ok(list);
    }

    // ✅ 回复权限验证
    @GetMapping("/replies/{parentId}")
    public ResponseEntity<List<Comment>> getReplies(@PathVariable Long parentId) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfComment(parentId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(commentRepo.findByParentIdOrderByCreatedAtAsc(parentId));
    }

    // ✅ 创建评论前验证权限（是否为任务所在项目成员）
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(comment.getTaskId(), currentUser)) {
            return ResponseEntity.status(403).body("❌ No permission to comment on this task");
        }

        comment.setCreatedAt(java.time.LocalDateTime.now());
        comment.setUserId(currentUser.getId());
        comment.setUsername(currentUser.getUsername());

        return ResponseEntity.ok(commentRepo.save(comment));
    }

    // ✅ 删除评论前权限检查
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestBody CommentDeleteRequest request) {
        User currentUser = AuthUtil.getCurrentUser();

        Optional<Comment> optionalComment = commentRepo.findById(id);
        if (optionalComment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = optionalComment.get();
        if (!tenantGuard.isMemberOfComment(id, currentUser)) {
            return ResponseEntity.status(403).body("❌ Not your project");
        }

        if (!request.getRole().equals("Admin") && !comment.getUserId().equals(request.getUserId())) {
            return ResponseEntity.status(403).body("❌ Not allowed to delete this comment");
        }

        commentRepo.delete(comment);
        return ResponseEntity.noContent().build();
    }

    // ✅ 编辑权限控制
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody Comment updated) {
        User currentUser = AuthUtil.getCurrentUser();

        Optional<Comment> optional = commentRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment existing = optional.get();

        if (!tenantGuard.isMemberOfComment(id, currentUser)) {
            return ResponseEntity.status(403).body("❌ Not your project");
        }

        if (!existing.getUserId().equals(updated.getUserId())) {
            return ResponseEntity.status(403).body("❌ Not allowed to edit this comment");
        }

        existing.setContent(updated.getContent());
        commentRepo.save(existing);
        return ResponseEntity.ok(existing);
    }
}
