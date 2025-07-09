package com.devboard.dto;

import com.devboard.model.Project;

public class ProjectDto {
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ProjectDto(Project p) {
        this.id = p.getId();
        this.name = p.getName();
    }
}
