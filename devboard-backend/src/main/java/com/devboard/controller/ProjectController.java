package com.devboard.controller;

import com.devboard.model.Project;
import com.devboard.model.User;
import com.devboard.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestParam String name, Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // ✅ 安全注入当前用户
        System.out.println("Create project called by user: " + user.getUsername() +
                " with role: " + user.getRole());
        Project project = projectService.createProject(name);
        return ResponseEntity.ok(project);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjectsForCurrentUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // ✅ 安全注入当前用户
        List<Project> projects = projectService.getProjectsForUser(user);
        return ResponseEntity.ok(projects != null ? projects : List.of()); // 防止 null 响应导致序列化失败
    }
}
