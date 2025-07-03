package com.devboard.repository;

import com.devboard.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskIdOrderByCreatedAtAsc(Long taskId);
    Page<Comment> findByTaskId(Long taskId, Pageable pageable);
    List<Comment> findByTaskIdAndParentIdIsNullOrderByCreatedAtAsc(Long taskId); // 新增：只查主评论
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId); // 新增：查某条评论的所有回复
}
