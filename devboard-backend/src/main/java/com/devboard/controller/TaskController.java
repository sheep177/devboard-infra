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

    // ✅ 获取所有任务（开发期开放，建议后期只按项目 ID 获取）
    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
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
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
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
                    Task savedTask = taskRepository.save(task);
                    return ResponseEntity.ok(savedTask);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        User currentUser = AuthUtil.getCurrentUser();

        if (!tenantGuard.isMemberOfTask(id, currentUser)) {
            return ResponseEntity.status(403).build();
        }

        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            taskRepository.delete(optionalTask.get());
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.status(404).build(); // 404
        }
    }

}
