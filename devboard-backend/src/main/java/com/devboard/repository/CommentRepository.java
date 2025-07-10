// ✅ CommentRepository.java
package com.devboard.repository;

import com.devboard.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskIdAndTenantId(Long taskId, Long tenantId);
    Optional<Comment> findByIdAndTenantId(Long id, Long tenantId);
    List<Comment> findByTenantId(Long tenantId);

}