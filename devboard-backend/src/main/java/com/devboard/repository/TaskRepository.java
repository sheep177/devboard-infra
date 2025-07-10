// ✅ TaskRepository.java（多租户查询接口）
package com.devboard.repository;

import com.devboard.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTenantId(Long tenantId);
    Optional<Task> findByIdAndTenantId(Long id, Long tenantId);
}