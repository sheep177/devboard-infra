package com.devboard.controller;

import com.devboard.dto.CommentDeleteRequest;
import com.devboard.model.Comment;
import com.devboard.repository.CommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173") // ✅ 显式写出 origin
public class CommentController {

    private final CommentRepository commentRepo;

    public CommentController(CommentRepository commentRepo) {
        this.commentRepo = commentRepo;
    }


    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }



    @GetMapping("/{taskId}")
    public Page<Comment> getCommentsPaged(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "desc") String sort // 👈 新增
    ) {
        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
        return commentRepo.findByTaskId(taskId, pageable);
    }



    @GetMapping("/{taskId}/all")
    public List<Comment> getAllComments(@PathVariable Long taskId) {
        return commentRepo.findByTaskIdOrderByCreatedAtAsc(taskId);
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        comment.setCreatedAt(java.time.LocalDateTime.now());
        return commentRepo.save(comment);
    }

    @GetMapping("/{taskId}/top")
    public List<Comment> getTopLevelComments(
            @PathVariable Long taskId,
            @RequestParam(defaultValue = "desc") String sort
    ) {
        Sort.Direction direction = sort.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        return commentRepo.findByTaskIdAndParentIdIsNull(taskId, Sort.by(direction, "createdAt"));
    }


    @GetMapping("/replies/{parentId}")
    public List<Comment> getReplies(@PathVariable Long parentId) {
        return commentRepo.findByParentIdOrderByCreatedAtAsc(parentId);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestBody CommentDeleteRequest request) {
        Optional<Comment> optionalComment = commentRepo.findById(id);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (!request.getRole().equals("Admin") && !comment.getUserId().equals(request.getUserId())) {
                return ResponseEntity.status(403).body("❌ Not allowed to delete this comment");
            }
            commentRepo.delete(comment);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody Comment updated
    ) {
        Optional<Comment> optional = commentRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment existing = optional.get();


        if (!existing.getUserId().equals(updated.getUserId())) {
            return ResponseEntity.status(403).body("❌ Not allowed to edit this comment");
        }

        existing.setContent(updated.getContent());
        commentRepo.save(existing);
        return ResponseEntity.ok(existing);
    }

}
