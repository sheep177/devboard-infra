package com.devboard.repository;

import com.devboard.model.ProjectMember;
import com.devboard.model.Project;
import com.devboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    Optional<ProjectMember> findByUserAndProject(User user, Project project);
    List<ProjectMember> findByProject(Project project);
    List<ProjectMember> findByUser(User user);
}
