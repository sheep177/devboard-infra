package com.devboard.service;

import com.devboard.model.Project;
import com.devboard.model.User;

import java.util.List;

public interface ProjectService {
    Project createProject(String name, User currentuser); // ✅ 修改：传入 user
    List<Project> getProjectsForUser(User user);
}
