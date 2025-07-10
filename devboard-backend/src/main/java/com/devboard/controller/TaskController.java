package com.devboard.controller;

import com.devboard.model.Task;
import com.devboard.repository.TaskRepository;
import com.devboard.security.AuthUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final AuthUtil authUtil;

    public TaskController(TaskRepository taskRepository, AuthUtil authUtil) {
        this.taskRepository = taskRepository;
        this.authUtil = authUtil;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        Long tenantId = authUtil.getCurrentTenantId();
        return taskRepository.findByTenantId(tenantId);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        task.setTenantId(authUtil.getCurrentTenantId());
        return taskRepository.save(task);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Long tenantId = authUtil.getCurrentTenantId();
        Optional<Task> task = taskRepository.findByIdAndTenantId(id, tenantId);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Long tenantId = authUtil.getCurrentTenantId();
        Optional<Task> optionalTask = taskRepository.findByIdAndTenantId(id, tenantId);
        if (optionalTask.isEmpty()) return ResponseEntity.notFound().build();

        Task task = optionalTask.get();
        task.setTitle(updatedTask.getTitle());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDescription(updatedTask.getDescription());
        task.setUpdatedAt(updatedTask.getUpdatedAt());
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        Long tenantId = authUtil.getCurrentTenantId();
        Optional<Task> task = taskRepository.findByIdAndTenantId(id, tenantId);
        if (task.isEmpty()) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
