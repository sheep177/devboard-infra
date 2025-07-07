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
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestParam String name) {
        Project project = projectService.createProject(name);
        return ResponseEntity.ok(project);
    }
    @GetMapping
    public ResponseEntity<List<Project>> getProjectsForCurrentUser() {
        User user = AuthUtil.getCurrentUser();
        return ResponseEntity.ok(projectService.getProjectsForUser(user));
    }
}
