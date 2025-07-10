package com.devboard.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String status;

    @Column(length = 1000)
    private String description;

    private String priority = "Medium";

    private Long projectId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long tenantId; // ✅ 新增：用于多租户隔离

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
