package com.codewith.firstApp.service;

import com.codewith.firstApp.dto.TaskRequest;
import com.codewith.firstApp.dto.TaskResponse;
import com.codewith.firstApp.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskRequest request);

    List<TaskResponse> getTasksByProject(Long projectId);

    List<TaskResponse> getTasksByUser(Long userId);

    List<TaskResponse> getAllTasks();

    TaskResponse getTaskById(Long id);

    TaskResponse updateTask(Long id, TaskRequest request);

    TaskResponse updateTaskStatus(Long id, TaskStatus status, String userEmail);

    void deleteTask(Long id);
}
