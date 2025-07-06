package com.devboard.service;

import com.devboard.model.Project;
import com.devboard.model.ProjectMember;
import com.devboard.model.User;
import com.devboard.repository.ProjectRepository;
import com.devboard.repository.ProjectMemberRepository;
import com.devboard.service.ProjectService;
import com.devboard.security.AuthUtil; // ✅ 修改后的 import
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Override
    public Project createProject(String name) {
        User currentUser = AuthUtil.getCurrentUser();
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
}
