package com.devboard.repository;

import com.devboard.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // 新增方法，按项目ID列表查询任务
    List<Task> findByProjectIdIn(List<Long> projectIds);
}
