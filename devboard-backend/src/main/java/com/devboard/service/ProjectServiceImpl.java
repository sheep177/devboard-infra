package com.devboard.service;

import com.devboard.model.Project;
import com.devboard.model.ProjectMember;
import com.devboard.model.User;
import com.devboard.repository.ProjectRepository;
import com.devboard.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Override
    public Project createProject(String name, User currentUser) {
        Project project = new Project();
        project.setName(name);
        projectRepository.save(project);

        ProjectMember member = new ProjectMember();
        member.setUser(currentUser);
        member.setProject(project);
        member.setRole(ProjectMember.Role.ADMIN);
        projectMemberRepository.save(member);

        return project;
    }

    @Override
    public List<Project> getProjectsForUser(User user) {
        return projectMemberRepository.findByUser(user).stream()
                .map(ProjectMember::getProject)
                .toList();
    }
}
