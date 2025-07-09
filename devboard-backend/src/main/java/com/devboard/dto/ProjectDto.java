package com.devboard.dto;

import com.devboard.model.Project;

public class ProjectDto {
    private Long id;
    private String name;

    public ProjectDto(Project p) {
        this.id = p.getId();
        this.name = p.getName();
    }
}
