package com.devboard.security;

import com.devboard.model.*;
import com.devboard.repository.CommentRepository;
import com.devboard.repository.ProjectMemberRepository;
import com.devboard.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TenantGuard {

    private final ProjectMemberRepository projectMemberRepo;
    private final TaskRepository taskRepo;
    private final CommentRepository commentRepo;

    public boolean isMember(Long projectId, User user) {
        return projectMemberRepo.findByUser(user).stream()
                .anyMatch(pm -> pm.getProject().getId().equals(projectId));
    }

    public boolean isMemberOfTask(Long taskId, User user) {
        return taskRepo.findById(taskId)
                .map(task -> isMember(task.getProjectId(), user))
                .orElse(false);
    }

    public boolean isMemberOfComment(Long commentId, User user) {
        return commentRepo.findById(commentId)
                .map(comment -> isMemberOfTask(comment.getTaskId(), user))
                .orElse(false);
    }
}
