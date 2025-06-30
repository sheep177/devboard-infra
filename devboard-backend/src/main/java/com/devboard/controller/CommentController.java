package com.devboard.controller;

import com.devboard.dto.CommentDeleteRequest;
import com.devboard.model.Comment;
import com.devboard.repository.CommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import com.devboard.dto.CommentDeleteRequest;


@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentRepository commentRepo;

    public CommentController(CommentRepository commentRepo) {
        this.commentRepo = commentRepo;
    }


    @GetMapping("/{taskId}")
    public List<Comment> getComments(@PathVariable Long taskId) {
        return commentRepo.findByTaskIdOrderByCreatedAtAsc(taskId);
    }


    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        comment.setCreatedAt(java.time.LocalDateTime.now());
        return commentRepo.save(comment);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestBody CommentDeleteRequest request) {
        Optional<Comment> optionalComment = commentRepo.findById(id);

        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();

            // 允许 Admin 或者评论作者本人删除
            if (!request.getRole().equals("Admin") && !comment.getUserId().equals(request.getUserId())) {
                return ResponseEntity.status(403).body("❌ Not allowed to delete this comment");
            }
            commentRepo.delete(comment);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }





}
