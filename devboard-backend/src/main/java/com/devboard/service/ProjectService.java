package com.devboard.service;

import com.devboard.model.Project;
import com.devboard.model.User;

import java.util.List;

public interface ProjectService {
    Project createProject(String name);
    List<Project> getProjectsForUser(User user);
}
