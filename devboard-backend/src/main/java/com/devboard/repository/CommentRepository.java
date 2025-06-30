package com.devboard.repository;

import com.devboard.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskIdOrderByCreatedAtAsc(Long taskId);
}
