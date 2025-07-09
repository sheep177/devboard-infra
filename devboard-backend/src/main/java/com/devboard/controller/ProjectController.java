// ProjectController.java
package com.devboard.controller;

import com.devboard.model.Project;
import com.devboard.model.User;
import com.devboard.security.AuthUtil;
import com.devboard.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestParam String name) {
        User user = AuthUtil.getCurrentUser(); // ✅ 静态调用，无需注入
        System.out.println("Create project called by user: " + user.getUsername() +
                " with role: " + user.getRole());
        Project project = projectService.createProject(name);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjectsForCurrentUser() {
        User user = AuthUtil.getCurrentUser(); // ✅ 静态调用
        return ResponseEntity.ok(projectService.getProjectsForUser(user));
    }
}

