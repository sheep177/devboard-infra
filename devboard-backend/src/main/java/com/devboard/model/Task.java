package com.devboard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String title;

    @Setter
    private String status;

    @Setter
    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long projectId;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private String priority = "Medium";

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Getter & Setter 省略只保留必要的：

}
