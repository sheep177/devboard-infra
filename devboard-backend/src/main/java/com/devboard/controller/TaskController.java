// TaskController.java
package com.devboard.controller;

import com.devboard.model.Task;
import com.devboard.model.User;
import com.devboard.repository.TaskRepository;
import com.devboard.security.AuthUtil;
import com.devboard.security.TenantGuard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskRepository taskRepository;
    private final TenantGuard tenantGuard;

    public TaskController(TaskRepository taskRepository, TenantGuard tenantGuard) {
        this.taskRepository = taskRepository;
        this.tenantGuard = tenantGuard;
    }

    @GetMapping("/tasks")
    public List<Task> getTasksForCurrentUser() {
        User currentUser = AuthUtil.getCurrentUser();
        List<Long> projectIds = tenantGuard.getProjectIdsForUser(currentUser);
        return taskRepository.findByProjectIdIn(projectIds);
    }

    @GetMapping("/tasks/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(id, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        User currentUser = AuthUtil.getCurrentUser();
        Long projectId = task.getProjectId();
        if (projectId == null || !tenantGuard.isMember(projectId, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        Task saved = taskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                           @RequestBody Task updatedTask) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(id, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setStatus(updatedTask.getStatus());
                    task.setDescription(updatedTask.getDescription());
                    task.setPriority(updatedTask.getPriority());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        User currentUser = AuthUtil.getCurrentUser();
        if (!tenantGuard.isMemberOfTask(id, currentUser)) {
            return ResponseEntity.status(403).build();
        }
        Optional<Task> opt = taskRepository.findById(id);
        if (opt.isPresent()) {
            taskRepository.delete(opt.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(404).build();
    }
}
