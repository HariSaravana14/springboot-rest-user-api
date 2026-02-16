package com.codewith.firstApp.repository;

import com.codewith.firstApp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUserId(Long userId);

    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<Task> findByAssignedUserIdOrderByCreatedAtDesc(Long userId);
}
