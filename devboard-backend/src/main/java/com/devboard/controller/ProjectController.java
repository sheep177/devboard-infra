// ✅ ProjectController.java（多租户逻辑）
package com.devboard.controller;

import com.devboard.model.Project;
import com.devboard.repository.ProjectRepository;
import com.devboard.security.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final AuthUtil authUtil;

    public ProjectController(ProjectRepository projectRepository, AuthUtil authUtil) {
        this.projectRepository = projectRepository;
        this.authUtil = authUtil;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        Long tenantId = authUtil.getCurrentTenantId();
        return projectRepository.findByTenantId(tenantId);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        project.setTenantId(authUtil.getCurrentTenantId());
        return projectRepository.save(project);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        Long tenantId = authUtil.getCurrentTenantId();
        Optional<Project> project = projectRepository.findByIdAndTenantId(id, tenantId);
        if (project.isEmpty()) return ResponseEntity.notFound().build();
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}