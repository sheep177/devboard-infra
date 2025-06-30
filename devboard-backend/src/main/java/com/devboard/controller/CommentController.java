package com.devboard.controller;

import com.devboard.model.Comment;
import com.devboard.repository.CommentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> delete(@PathVariable Long id) {
        commentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
