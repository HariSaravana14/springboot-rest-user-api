package com.codewith.firstApp.service.impl;

import com.codewith.firstApp.dto.TaskRequest;
import com.codewith.firstApp.dto.TaskResponse;
import com.codewith.firstApp.entity.Project;
import com.codewith.firstApp.entity.Task;
import com.codewith.firstApp.entity.TaskStatus;
import com.codewith.firstApp.entity.User;
import com.codewith.firstApp.exception.BadRequestException;
import com.codewith.firstApp.exception.ResourceNotFoundException;
import com.codewith.firstApp.repository.ProjectRepository;
import com.codewith.firstApp.repository.TaskRepository;
import com.codewith.firstApp.repository.UserRepository;
import com.codewith.firstApp.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.codewith.firstApp.entity.Role;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public TaskResponse createTask(TaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .project(project)
                .dueDate(request.getDueDate())
                .build();

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            task.setAssignedUser(assignedUser);
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTasksByUser(Long userId) {
        return taskRepository.findByAssignedUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToResponse(task);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getAssignedUserId() != null) {
            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
            task.setAssignedUser(assignedUser);
        }

        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status, String userEmail) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Admins can update any status. Regular users can only update their own tasks.
        if (currentUser.getRole() != Role.ADMIN) {
            if (task.getAssignedUser() == null || !task.getAssignedUser().getEmail().equals(userEmail)) {
                throw new BadRequestException("You can only update status of tasks assigned to you");
            }
        }

        task.setStatus(status);
        task = taskRepository.save(task);
        return mapToResponse(task);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .projectId(task.getProject().getId())
                .projectTitle(task.getProject().getTitle())
                .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
                .assignedUserName(task.getAssignedUser() != null ? task.getAssignedUser().getName() : null)
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
