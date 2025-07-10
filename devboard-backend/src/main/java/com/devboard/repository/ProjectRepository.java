// ✅ ProjectRepository.java
package com.devboard.repository;

import com.devboard.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTenantId(Long tenantId);
    Optional<Project> findByIdAndTenantId(Long id, Long tenantId);
}