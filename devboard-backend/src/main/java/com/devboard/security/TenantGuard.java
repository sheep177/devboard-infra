package com.devboard.security;

import com.devboard.model.*;
import com.devboard.repository.CommentRepository;
import com.devboard.repository.ProjectMemberRepository;
import com.devboard.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TenantGuard {

    private final ProjectMemberRepository projectMemberRepo;
    private final TaskRepository taskRepo;
    private final CommentRepository commentRepo;

    // 判断用户是否是某个项目成员
    public boolean isMember(Long projectId, User user) {
        return projectMemberRepo.findByUser(user).stream()
                .anyMatch(pm -> pm.getProject().getId().equals(projectId));
    }

    // 判断用户是否是某个任务所属项目的成员
    public boolean isMemberOfTask(Long taskId, User user) {
        return taskRepo.findById(taskId)
                .map(task -> isMember(task.getProjectId(), user))
                .orElse(false);
    }

    // 判断用户是否是某个评论所属任务项目的成员
    public boolean isMemberOfComment(Long commentId, User user) {
        return commentRepo.findById(commentId)
                .map(comment -> isMemberOfTask(comment.getTaskId(), user))
                .orElse(false);
    }

    // 新增：获取用户参与的所有项目ID列表
    public List<Long> getProjectIdsForUser(User user) {
        return projectMemberRepo.findByUser(user).stream()
                .map(pm -> pm.getProject().getId())
                .toList();
    }
}
