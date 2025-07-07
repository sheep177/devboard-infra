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


    // ✅ 创建任务（需要确保前端传递正确的 projectId）
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
        // ✅ 获取当前用户
        User currentUser = AuthUtil.getCurrentUser();

        // ✅ 权限检查：当前用户是否有权删除该任务
        if (!tenantGuard.isMemberOfTask(id, currentUser)) {
            return ResponseEntity.status(403).build(); // ❌ 禁止访问（不是成员）
        }

        // ✅ 尝试查找并删除任务，返回对应状态
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.noContent().build(); // ✅ 删除成功，返回 204
                })
                .orElse(ResponseEntity.<Void>notFound().build()); // ✅ 未找到任务，返回 404
    }}

